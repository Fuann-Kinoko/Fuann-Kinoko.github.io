+++
title = "Luogu P2123 皇后游戏 题解"
tags = ["OI"]
date = 2019-10-15
description = "P2123 贪心 排序 题解"
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/ribuyuuki/ribuyuuki6.webp'
+++

传送门：[P2123](https://www.luogu.org/problem/P2123)

首先，显而易见的，$C_n$一定大于之前的所有$C_i$，拿钱最多的一定是最后一个。所以这不是一个二分题。







<center><font color=gray size=72>拆式</font></center>






设$S_i=\sum_{j=1}^ia_j$，$T_i=\sum_{j=i}^nb_j$

以有四个大臣为例
$$
C_4=max(C_3,S_4)+b_4=max(C_3+b_4,S_4+b_4) \tag*{①}
$$

$$
C_3=max(C_2,S_3)+b_3=max(C_2+b_3,S_3+b_3) \tag*{②}
$$

$$
C_2=max(C_1,S_2)+b_2=max(C_1+b_2,S_2+b_2) \tag*{③}
$$

$$
C_1=S_1+b_1 \tag*{④}
$$

将式子$①②③④$以递归的思想展开
$$
C_2=max(S_1+b_1+b_2,S_2+b_2)
$$

$$
C_3=max(S_1+b_1+b_2+b_3,S_2+b_2+b_3,S_3+b_3)
$$

$$
C_4=max(S_1+b_1+b_2+b_3+b_4,S_2+b_2+b_3+b_4,S_3+b_3+b_4,S_4+b_4)
$$

化简为
$$
C_4=max(S_1+T_1,S_2+T_2,S_3+T_3,S_4+T_4)
$$
同理归纳出
$$
C_n=max(S_1+T_1,S_2+T_2,...,S_n+T_n)  \tag*⑤
$$
为了方便，用$2\times{n}$的矩阵表示
$$
\left[
 \begin{matrix}
   a_1 & a_2 & a_3 & ...& a_n\\\\
   b_1 & b_2 & b_3 & ...& b_n
  \end{matrix}
  \right]
$$
记$P_n(k)$表示选择矩阵中$a_1+a_2+...+a_k+b_k+b_{k+1}+...+b_n$的路径,即$S_k+T_k$

由$⑤$可得$C_n=max(P_n(1),P_n(2),...,P_n(n))$ 

我们想要干的就是调整$a,b$序列的顺序，使得$C_n$最小。但直接调整整个序列实在不现实。







<center><font color=gray size=72>排序</font></center>






考虑冒泡排序法,比较相邻两列$j,k$并按某种方式交换以得到最优序列。~~正确性就是冒泡的正确性~~

单独提出两列$
\left[
 \begin{matrix}
   a_j & a_k\\\\
   b_j & b_k
  \end{matrix}
  \right]
$，交换后的话就是$
\left[
 \begin{matrix}
   a^{'}_j & a^{'}_k\\\\
   b^{'}_j & b^{'}_k
  \end{matrix}
  \right]
$  ，有$a^{'}_j=a_k,a^{'}_k=j$，$b$的两个数同理

设交换后矩阵为$C^{'}_n$由上面定义可以得$P^{'}_n(i)=P_n(i),i\in[1,j)\bigcup(k,n]$

要讨论的就是不相等的$P^{'}_n(j)，P_n(j)$以及$P^{'}_n(k)，P_n(k)$

令$Other$表示$S_n+T_1-a_j-b_j-a_k-b_k$，$Other=S_n+T_n-a^{'}_j-b^{'}_j-a^{'}_k-b^{'}_k$

$P_n(j)=Other+a_j+b_j+b_k$ 

$P_n(k)=Other+a_j+a_k+b_k$

$P^{'}_n(j)=Other+a^{'}_j+b^{'}_j+b^{'}_k=Other+a_k+b_k+b_j $

$P^{'}_n(k)=Other+a^{'}_j+a^{'}_k+b^{'}_k=Other+a_k+a_j+b_j$

对于$a_j,b_j,a_k,b_k$四数进行分类讨论

- $a_j$为四数最小，则四式最大的是$P^{'}_n(j)$，可得$C_n\leq{C^{'}_n}$
- $a_k$为四数最小，则四式最大的是$P_n(j)$，可得$C_n\geq{C^{'}_n}$
- $b_j$为四数最小，则四式最大的是$P_n(k)$，可得$C_n\geq{C^{'}_n}$
- $b_j$为四数最小，则四式最大的是$P^{'}_n(k)$，可得$C_n\leq{C^{'}_n}$

得到结论:若$a_k$或$b_j$为四数最小，则交换后的$C_n$更小

用矩阵来说就是当相邻两列$
\left[
 \begin{matrix}
   a_j & a_k\\\\
   b_j & b_k
  \end{matrix}
  \right]
$的最小数存在于左下至右上的对角线上时，应当交换

当然，也可以写作$min(a_j,b_k)>min(a_k,b_j)  \tag*⑥$ 







<center><font color=gray size=72>代码实现</font></center>






根据⑥式，就能写出重载<运算符的式子

$min(a_j,b_k)<min(a_k,b_j)$

这样在数学中，使用冒泡排序是正确的。

但运用到std::sort就不一定了：

以下内容，部分引用自论文《[浅谈邻项交换排序的应用以及需要注意的问题](https://ouuan.github.io/%E6%B5%85%E8%B0%88%E9%82%BB%E9%A1%B9%E4%BA%A4%E6%8D%A2%E6%8E%92%E5%BA%8F%E7%9A%84%E5%BA%94%E7%94%A8%E4%BB%A5%E5%8F%8A%E9%9C%80%E8%A6%81%E6%B3%A8%E6%84%8F%E7%9A%84%E9%97%AE%E9%A2%98/)》，以及机房内Z神仙的发言

std::sort中可不是冒泡排序，它的实现相当复杂，做到了极高的效率。也正因如此，它对比较函数的要求也十分严格。std::sort要求比较函数为严格弱序。

对于一个比较运算符（用“$<$”表示此运算符，用“$\not<$”表示不满足此运算符），若满足以下四个条件，则称其是满足严格弱序的：

1. $x\not<x$ （非自反性）
2. 若 $x<y$，则 $y\not<x$ （非对称性）
3. 若 $x<y，y<z$，则 $x<z$ （传递性）
4. 若 $x\not<y,y\not<x,y\not<z,z\not<y$，则 $x\not<z,z\not<x$ （不可比性的传递性）

第四点还有另一个版本：

```log
It has to have transitivity of equivalence, which means roughly: If a is equivalent to b and b is equivalent to c, then a is equivalent to c.

This means that for operator <: If !(a<b)&&!(b<a) is true and !(b<c)&&!(c<b) is true , then !(a<c)&&!(c<a) is true.

This means that for a predicate op(): If op(a,b), op(b,a), op(b,c), and op(c,b) all yield false, then op(a,c) and op(c,a) yield false.
```



我们可以证明这个式子不满足不可比性的传递性，详情看上面的论文

因此这个式子不能用作比较函数

要使其成为比较函数，还需要更多的条件。

当$min(a_j,b_k)==min(a_k,b_j)$ 时，根据式子来说交换不交换无所谓。但实际上，把$a$更小的放前面才能保证排序的正确性。

先来一个口胡版：

从另一个角度理解，本题就是个流水调度问题。对于原料的粗加工相当于$a_i$，精加工相当于$b_i$。题目就是求从粗加工第一种原料开始至精加工完最后一种原料的最短时间。我们要精加工机器的空闲时间最少，就希望先加工$a_i<b_i$的原料，让精加工机器少闲着。

这个不是严格的证明，但应该能解释$min(a_j,b_k)==min(a_k,b_j)$时为什么$a$小的放前面。

事实上，这种以冒泡而延展出的比较函数，将原下标加入比较，强行使其满足严格弱序这种方式已经可以算是套路了。下次遇见这类题，也可以贪心地从下标比较，尝试使其满足严格弱序。





至此，我们得到了正确的排序方式。





AC代码：

```c++
#include <bits/stdc++.h>
#define mem(O) memset(O,0,sizeof(O))
using namespace std;
typedef long long ll;

inline int red(){
	int x=0,f=1;char ch=getchar();for(;!isdigit(ch);ch=getchar())if(ch=='-')f=-1;
	for(;isdigit(ch);ch=getchar())x=x*10+ch-'0';return x*f;
}

const int N = 1e5+10;
const ll INF = 0x3f3f3f3f3f3f3f3f;

ll s[N],t[N];int n;
struct node{ll a,b,id;}g[N];
bool operator < (const node A1,const node A2) {
	if(min(A1.a,A2.b)==min(A2.a,A1.b))	return A1.a<A2.a;
	return min(A1.a,A2.b)<min(A2.a,A1.b);
}

int main(){
	int Tim=red();
	while(Tim--){
		n=red();
		for(int i=1;i<=n;++i)	g[i].a=red(),g[i].b=red();
		sort(g+1,g+n+1);
		for(int i=1;i<=n;++i)	s[i]=s[i-1]+g[i].a;
		for(int i=n;i>=1;--i)	t[i]=t[i+1]+g[i].b;
		ll ans=0;
		for(int i=1;i<=n;++i)	ans=max(ans,s[i]+t[i]);
		printf("%lld\n",ans);
		mem(g),mem(s),mem(t);
	}
	return 0;
}
```


