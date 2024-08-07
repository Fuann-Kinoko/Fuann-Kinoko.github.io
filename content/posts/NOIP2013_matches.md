+++
title = "NOIP2013 火柴排队 题解"
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/ribuyuuki/ribuyuuki5.webp'
date = 2019-10-29
tags = ["OI"]
description = "NOIP2013 逆序对 树状数组"
+++
## 题目描述

涵涵有两盒火柴，每盒装有 n 根火柴，每根火柴都有一个高度。 现在将每盒中的火柴各自排成一列， 同一列火柴的高度互不相同， 两列火柴之间的距离定义为：$\sum(a_i-b_i)^2$

其中 ai 表示第一列火柴中第 i 个火柴的高度，bi 表示第二列火柴中第 i 个火柴的高度。

每列火柴中相邻两根火柴的位置都可以交换，请你通过交换使得两列火柴之间的距离最小。请问得到这个最小的距离，最少需要交换多少次？如果这个数字太大，请输出这个最小交换次数对 99,999,997 取模的结果。

## 输入输出

输入样例1															   

- 4
  2 3 1 4
  3 2 1 4

输出样例1

- 1

输入样例2															

- 4
  1 3 4 2
  1 7 2 4

输出样例2

- 2

【数据范围】

对于 10%的数据，  1 ≤ n ≤ 10；

对于 30%的数据，  1 ≤ n ≤ 100；

对于 60%的数据，  1 ≤ n ≤ 1,000；

对于 100%的数据，1 ≤ n ≤ 100,000，0 ≤火柴高度≤ max long int；

## 题解

最初看见这题时根本没有思路。想了很久，决定先从式子入手。

将$\sum(a_i-b_i)^2$展开，可以得到$\sum(a_i^2+b_i^2-2a_ib_i)$

消掉不变的量$a_i^2,b_i^2$，说明顺序变化对于距离来说的影响就是$- 2a_ib_i$

既然要距离最小，转化题意后即是**求$\sum a_ib_i$最大**

于是思考怎样的顺序才能使$\sum a_ib_i$最大

<br><br><br>

如果是两个完全升序和降序的排列，我们可以~~感性地~~认识到它们的$\sum a_ib_i$最大。

但是完全排序的交换次数肯定比样例给的大。根据样例，可以推测，**当两个序列的值序相同时，就能使$\sum a_ib_i$最大**。这点可以从完全排序的情况推出——将a序列和b序列看作两排，那么交换两列后，两排对应的值没有变。

也可以用反证法证明：

假设有序列$a_1,a_2,...,a_n$与$b_1,b_2,...,b_n$，两序列值序相同，得到距离$A$

即有$(a_k>a_{k+1})==(b_k>b_{k+1})$，$k\in[1,n),k\in Z$

若按照题意交换$a_k,a_{k+1}$，得到距离$A^{'}$

那么 
$$
\begin{align}
A^{'}-A &= (a_{k+1}b_k+a_kb_{k+1})-(a_kb_k+a_{k+1}b_{k+1})\\\\
        &= (a_{k+1}-a_k)b_k+(a_k-a_{k+1})b_{k+1}\\\\
        &= (a_{k+1}-a_k)(b_k-b_{k+1})
\end{align}
$$
由定义知，$A^{'}-A<0$，那么交换之后一定不优。

反过来证明了值序相同时是最优的

<br><br><br>

这样题意再一次转换了：将a序列的值序转化成与b序列一致，求交换的最小次数。

交换的次数怎么求呢？

我们知道（~~也许不知道~~），逆序对有种$O(n^2)$的算法就是冒泡排序，交换次数等于逆序对数。这里题目说的是两两相邻交换，那不就跟冒泡排序差不多吗？**逆序对的个数，也就是交换的次数**了。

注意一点：冒泡排序是排到完全有序，而我们这里是排到值序相同。为了实现这一点，具体操作就是在求逆序对时将下标设成正确的值序，这样值序小而值大的就会被交换，满足题目要求。

因为是值序，所以可以离散化。（~~我离散挂了STL QNMD~~）

逆序对求法看个人习惯，我只会打树状数组



AC代码：

```c++
#include <bits/stdc++.h>
using namespace std;

inline int red(){
	int x=0,f=1;char ch=getchar();for(;!isdigit(ch);ch=getchar())if(ch=='-')f=-1;
	for(;isdigit(ch);ch=getchar())x=x*10+ch-'0';return x*f;
}

const int N = 1e6+10;
const int MOD = 99999997;
int n;

int a[N][2];
int pos[N],hsh[N];
struct BIT{
	int c[N];
	#define lowbit(x) (x&(-x))
	void update(int u,int va){for(;u<=n;u+=lowbit(u))	c[u]+=va;}
	int query(int u){int sum=0;for(;u;u-=lowbit(u))	sum+=c[u];return sum;}
}b;

void discrete(int op){
	for(int i=1;i<=n;++i)	pos[i]=a[i][op];
	sort(pos+1,pos+n+1);
	int m=unique(pos+1,pos+n+1)-pos;
	for(int i=1;i<=n;++i)	a[i][op]=lower_bound(pos+1,pos+n+1,a[i][op])-pos;
}

int main(){
	n=red();
	for(int i=1;i<=n;++i)	a[i][0]=red();
	for(int i=1;i<=n;++i)	a[i][1]=red();
	discrete(0),discrete(1);
	for(int i=1;i<=n;++i)	hsh[a[i][0]]=i;
	for(int i=1;i<=n;++i)	a[i][1]=hsh[a[i][1]];
	int ans=0;
	for(int i=1;i<=n;++i){
		b.update(a[i][1],1);
		ans=(ans+i-b.query(a[i][1]))%MOD;
	}
	printf("%d",ans);
	return 0;
}
```


