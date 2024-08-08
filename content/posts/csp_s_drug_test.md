+++
title = "CSP-S测试 药品试验 题解"
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/csps_s_drug_test.webp'
date = 2019-11-08
tags = ["OI"]
description = "数学"
+++
## 题目描述

化简后的题意大概如此：

给出$\alpha$与$\beta$，有

$P(a)=(1-\alpha)\beta$，$P(b)=\alpha\beta+(1-\alpha)(1-\beta)$，$P(c)=\alpha(1-\beta)$

有序列满足$f_i=af_{i-1}+bf_i+cf_{i+1}$，$f_0=0,f_{2n}=1$，求$f_n$的值

## 题解

### 20%

将$f_1=0,f_{2n}=1$代入式子高斯消元即可

### 100%

#### 解法1

时间复杂度$O(n)$

由$f_i=af_{i-1}+bf_i+cf_{i+1}$，可得
$$
f_{i+1}=\frac{(1-b)f_i-af_{i-1}}{c}
$$
设$f_1=x$，可以用$k_ix$的形式表示$f_2,f_3,...f_{2n}$。

线性递推，用$f_{2n}=1$可以解出$x$，代入$f_n=k_nx$即可求出答案

#### 解法2

时间复杂度$O(2^3log n)$

在解法1的基础上用矩阵快速幂优化

#### 解法3

时间复杂度$O(1)$

首先根据定义可知$a+b+c=1$

对式子化简：

$\begin{array} & (1-b)f_i=af_{i-1}+cf_{i+1} \\\\ (a+c)f_i=af_{i-1}+cf_{i+1} \\\\ a(f_i-f_{i-1})=c(f_{i+1}-f_i) \end{array} \\\\ \frac{f_{i+1}-f_i}{f_i-f_{i-1}}=\frac{a}{c}$ 

此差分式为等比数列，令$k=\frac a c$，$k$即为公比，用等比数列求和求出

$f_i=f_1 \frac{k^i-1}{k-1}$

这样就可以$O(n)$做了，但我们还可以进一步优化：

发现$f_{2n}=1=f_1\frac{k^{2n}-1}{k-1}\tag①$

又有$f_n=f_1 \frac{k^n-1}{k-1}\tag ②$，

②①相除可得$f_n=\frac{k^n-1}{k^{2n}-1}=\frac{1}{k^n+1}$

代入$n$可以$O(1)$求解



AC代码：

```c++
#include<bits/stdc++.h>
#define nc() getchar()
using namespace std;
typedef long long ll;

inline int red(){
	int x=0,f=1;char ch=nc();for(;!isdigit(ch);ch=nc())if(ch=='-')f=-1;
	for(;isdigit(ch);ch=nc())x=x*10+ch-'0';return x*f;
}

const ll MOD = 1e9+7;

int n;

inline ll ksm(ll rea,ll reb){
	ll ret=1;
	for(;reb;reb>>=1,rea=rea*rea%MOD)if(reb&1)ret=ret*rea%MOD;
	return ret;
}

int main(){
	n=red();n=2*n-1;
	ll arufa=red(),beruta=red();
	ll A=(beruta-arufa*beruta%MOD+MOD)%MOD;
	ll C=(arufa-arufa*beruta%MOD+MOD)%MOD;
	ll K=A*ksm(C,MOD-2)%MOD;
	ll TEMP=(ksm(K,n/2+1)+1)%MOD;
	printf("%lld",ksm(TEMP,MOD-2));
	return 0;
}
```


