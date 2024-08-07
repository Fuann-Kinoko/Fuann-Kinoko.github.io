+++
title = "BZOJ4499 【改】 题解"
tags = ['OI']
date = 2019-10-07
description = "BZOJ4499 线性函数 题解"
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/ribuyuuki/ribuyuuki0.png'
+++

由于BZOJ炸了，所以把题目描述也奉上



这个是BZOJ4499的改题，倒不如说更简单了



<font  size="5" color="blue">题目描述</font>



小C最近在学习线性函数，线性函数可以表示为：$f(x) = k*x + b$。

现在小C面前有n个线性函数$f_i(x)=k_i*x+b_i$ ，他对这n个线性函数执行m次操作，每次可以：

1.M i K B 代表把第i个线性函数改为：$fi(x)=k*x+b$ 。



2.Q k 表示对1进行前k次线性映射后的结果



<font  size="5" color="blue">输入</font>



第一行两个整数n, m (1 <= n, m <= 200,000)。



接下来n行，每行两个整数$k_i$, $b_i$。



接下来m行，每行的格式为M i K B或者Q k。



<font  size="5" color="blue">输出</font>



对于每个Q操作，输出一行答案。



<font  size="5" color="blue">样例输入</font>

4 5
1 3
2 4
3 1
3 4
Q 4
C 2 3 1
Q 4
C 4 1 1
Q 4





<font  size="5" color="blue">样例输出</font>



115
124
41



<font  size="5" color="blue">提示</font>



对于 30%的数据，n,q≤1000

对于另外 20%的数据，$a_i$=1,修改操作中 $a$=1

对于 85%数据，n,q≤ 1e5

对于 100%数据，1≤n,q≤5∗1e5，0≤$a_i,b_i$≤10





这题的思维难度不大



假设有$f_i(f_j(x))$展开

得到  $a(cx+d)+b$

那么就能轻易列出矩阵方程,

\begin{bmatrix}
  a & b \\\\
  0 & 1
\end{bmatrix}
\begin{bmatrix}
  c & d \\\\
  0 & 1
\end{bmatrix}  
$=$
\begin{bmatrix}
  ac & ad+b \\\\
  0 & 1
  \end{bmatrix}  



想要维护前k个，用线段树即可



（一个小细节：由于矩阵没有乘法交换律，依照这样的方式建线段树，查询时应查询n-k+1~n的积）



代码附上


```c++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

inline int red(){
	int x=0,f=1;char ch=getchar();for(;!isdigit(ch);ch=getchar())if(ch=='-')f=-1;
	for(;isdigit(ch);ch=getchar())x=x*10+ch-'0';return x*f;
}

const ll MOD = 1e9+7;
const int N = 5e5+10;

struct matrix{
	ll a[2][2];
	matrix(){memset(a,0,sizeof(a));}
	friend matrix operator *(matrix B);
};
matrix operator * (matrix A,matrix B){
	matrix C;
	for(int i=0;i<2;++i)	for(int j=0;j<2;++j)	for(int k=0;k<2;++k)
	C.a[i][j]=(C.a[i][j]+A.a[i][k]*B.a[k][j])%MOD;
	return C;
}

int a[N],b[N];
int n,q;
matrix val[N<<2];
#define ls (o<<1)
#define rs (o<<1|1)
inline void pushup(int o){
	val[o]=val[ls]*val[rs];
}
void build(int o,int l,int r){
	if(l==r){val[o].a[0][0]=a[n-l+1],val[o].a[0][1]=b[n-l+1],val[o].a[1][1]=1;return;}
	int mid=l+r>>1;
	build(ls,l,mid),build(rs,mid+1,r);
	pushup(o);
}
void modify(int o,int tl,int tr,int tar,int xa,int xb){
	if(tl==tr){val[o].a[0][0]=xa,val[o].a[0][1]=xb,val[o].a[1][1]=1;return;}
	int mid=tl+tr>>1;
	if(tar<=mid)	modify(ls,tl,mid,tar,xa,xb);
	else			modify(rs,mid+1,tr,tar,xa,xb);
	pushup(o);
}
matrix query(int o,int l,int r,int tl,int tr){
	if(l<=tl&&tr<=r)	return val[o];
	matrix ret;ret.a[0][0]=ret.a[1][1]=1;
	int mid=tl+tr>>1;
	if(l<=mid)	ret=ret*query(ls,l,r,tl,mid);
	if(r>mid)	ret=ret*query(rs,l,r,mid+1,tr);
	pushup(o);
	return ret;
}

char opt[4];

int main(){
	n=red(),q=red();
	for(int i=1;i<=n;++i)		a[i]=red(),b[i]=red();
	build(1,1,n);
	for(int i=1;i<=q;++i){
		scanf("%s",opt);
		if(opt[0]=='Q'){
			int k=red();
			matrix ret=query(1,n-k+1,n,1,n);
			ll p=(ret.a[0][0]+ret.a[0][1]+MOD)%MOD;
			printf("%lld\n",p);
		}
		else{
			int k=red(),xa=red(),xb=red();
			modify(1,1,n,n-k+1,xa,xb);
		}
	}
	return 0;
}
```


你以为这就A了？不，这只有85分



由于2*2矩阵常数过大，所以会有点T掉



这时我们需要手写矩阵乘来进行优化



AC代码：


```c++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

inline int red(){
	int x=0,f=1;char ch=getchar();for(;!isdigit(ch);ch=getchar())if(ch=='-')f=-1;
	for(;isdigit(ch);ch=getchar())x=x*10+ch-'0';return x*f;
}

const ll MOD = 1e9+7;
const int N = 5e5+10;

struct matrix{
	ll a[2];
	matrix(){memset(a,0,sizeof(a));}
	friend matrix operator *(matrix B);
};
matrix operator * (matrix A,matrix B){
	matrix C;
	C.a[0]=A.a[0]*B.a[0]%MOD;
	C.a[1]=(A.a[0]*B.a[1]+A.a[1])%MOD;
	return C;
}

int a[N],b[N];
int n,q;
matrix val[N<<2];
#define ls (o<<1)
#define rs (o<<1|1)
inline void pushup(int o){
	val[o]=val[ls]*val[rs];
}
void build(int o,int l,int r){
	if(l==r){val[o].a[0]=a[n-l+1],val[o].a[1]=b[n-l+1];return;}
	int mid=l+r>>1;
	build(ls,l,mid),build(rs,mid+1,r);
	pushup(o);
}
void modify(int o,int tl,int tr,int tar,int xa,int xb){
	if(tl==tr){val[o].a[0]=xa,val[o].a[1]=xb;return;}
	int mid=tl+tr>>1;
	if(tar<=mid)	modify(ls,tl,mid,tar,xa,xb);
	else			modify(rs,mid+1,tr,tar,xa,xb);
	pushup(o);
}
matrix query(int o,int l,int r,int tl,int tr){
	if(l<=tl&&tr<=r)	return val[o];
	int mid=tl+tr>>1;
	pushup(o);
	if(r<=mid)		return query(ls,l,r,tl,mid);
	else if(l>mid)	return query(rs,l,r,mid+1,tr);
	else	return query(ls,l,r,tl,mid)*query(rs,l,r,mid+1,tr);
}

char opt[4];

int main(){
	n=red(),q=red();
	for(int i=1;i<=n;++i)		a[i]=red(),b[i]=red();
	build(1,1,n);
	for(int i=1;i<=q;++i){
		scanf("%s",opt);
		if(opt[0]=='Q'){
			int k=red();
			matrix ret=query(1,n-k+1,n,1,n);
			ll p=(ret.a[0]+ret.a[1]+MOD)%MOD;
			printf("%lld\n",p);
		}
		else{
			int k=red(),xa=red(),xb=red();
			modify(1,1,n,n-k+1,xa,xb);
		}
	}
	return 0;
}
```
