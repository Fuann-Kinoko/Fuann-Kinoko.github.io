+++
title = "有关C(n+k-1,2k-1)的代数意义及证明"
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/random_math_thought/random_math_thought.webp'
date = 2020-02-09
tags = ["随想", "math"]
description = "组合数学"
+++
***本文章由我（CXL）与ZYF共同完成，经ZYF同意放在个人博客上***

# Part 1

数学课上想了道题：

​		设$x_1,x_2,...,x_k \in N^{\star}$，$n\in N^{\star}$，有$\sum_{i=1}^{k}x_i=n$，令集合A为所有可能的k元组$(x_1,x_2,...,x_k)$的集合，$\alpha$是A中的元素，且$\alpha=(x_1,x_2,...,x_k)$。定义$T(\alpha)=\prod_{i=1}^{k}x_k$,求$\sum_{\alpha\in A}T(\alpha)$。

这个表述看起来有点吓人，其实举个例子就很简单：

​		比如k=3,n=3.求的结果就是$1{\star}1{\star}1=1$

​			   k=3,n=4.求的结果就是$1{\star}1{\star}2+1{\star}2{\star}1+2{\star}1{\star}1=6$

​		即选出k个正整数，让这些数的和为n。定义在这个条件下让这k个数相乘的结果为$T（x_1,x_2,...,x_k）$，求所有T之和。



怎么解？没思路。于是回家写了个程序打表找规律。

~~然后就找出来了，是C(n+k-1,2k-1)，是个组合数~~   运气真好（

# Part 2

怎么能够只满足于结论呢！

想了很多种几何意义，想尝试将其与组合数结合，还是没有证明出来。最后在ZYF数竞巨佬的带领下，成功完成了证明。

证明：

以$x_1,x_2,...,x_k$为轴建立$k$维直角坐标系。

对于其中一个点$P(p_1,p_2,...,p_k)$，定义其生成胞体$\Omega P$如下：

​	过$p_k$个$k-1$维空间作垂线，这$k$个$k-1$维空间是

​		直线$ox_1,ox_2,...,ox_{k-2},ox_{k-1}$所在空间

​		直线$ox_1,ox_2,...,ox_{k-2},ox_k$所在空间

​		...

​		直线$ox_2,ox_3,...,ox_{k-1},ox_k$所在空间

​	以这k条垂线为棱便得到此胞体

将k元组$\alpha$与k维空间中的点$X(x_1,x_2,...,x_k)$对应，则$T(\alpha)$即为$\Omega(X)$中单位胞体的个数

![二维和三维图](https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/random_math_thought/01.webp)

设A中元素对应的点集合为B，设$\Delta(X)$为$\Omega(X)$的单位胞体个数，则$\sum_{\alpha\in A}T(\alpha)=\sum_{X\in B}\Omega(X)$。

易知B中元素皆是空间$\delta：x_1+x_2+...+x_k=n$上的极点。

![二维图](https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/random_math_thought/02.webp)

现在就要考虑每个单位胞体被计算的次数，即求它被多少个B中元素的生成胞体包含。



我们用一个单位胞体中，坐标之和最大的那个点来代指这个单位胞体。如果一个单位胞体$Q(q_1,q_2,...,q_k)$满足$n-(q_1+q_2+...+q_k)=i-1$，则称它位于第$i$层。

![二维图](https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/random_math_thought/03.webp)

因为在第$i$层的胞体Q满足$q_1+q_2+...+q_k=n-i+1$，所以这一层有$C_{i-1}^{k-1}$个单位胞体。注意到一个胞体Q被包含在点$P(p_1,p_2,...,p_k)$的生成胞体$\Omega(P)$中的充要条件是：

​	$\forall i\in{(1,2,...,k)},p_i>=q_i$成立

![二维图](https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/random_math_thought/04.webp)

因此可以得到，对于某个位于第$i$层的单位胞体Q，若B中的点X的生成胞体包含它，则

​	$\forall i\in{(1,2,...,k)},x_i-q_i>=0$

由于$\sum_{i=1}^{k}(x_i-q_i)=\sum_{i=1}^kx_i-\sum_{i=1}^kq_i=n-(n-i+1)=i-1$，

故k元组$(x_1-q_1,x_2-q_2,...,x_k-q_k)$有$C_{i+k-2}^{k-1}$中取法。

即k元组$(x_1,x_2,...,x_k)$有$C_{i+k-2}^{k-1}$\

即有$C_{i+k-2}^{k-1}$个$\Omega(X)$包含单位胞体Q，则第$i$层中所有胞体被计算次数为$C_{i+k-2}^{k-1}{\star}C_{n-i}^{k-1}$。于是：

​	$\sum_{\alpha\in A}T(\alpha)=\sum_{X\in B}\Delta(X)=\sum_{i=1}^{n-k+1} C_{k+i-2}^{k-1}{\star}C_{n-i}^{k-1}$



要证明$\sum_{i=1}^{n-k+1} C_{k+i-2}^{k-1}{\star}C_{n-i}^{k-1}=C_{n+k-1}^{2k-1}$

令$k-1=t$（为了方便），则原式等价于求$\sum_{i=1}^{n-t}C_{t+i-1}^{t}{\star}C_{n-i}^t=C_{n+t}^{2t+1}$

令$n+t-1=m$

LHS（指左等式）=$\sum_{i=1-t}^{n}C_{t+i-1}^{t}{\star}C_{n-t}^t=\sum_{i=0}^{n+t-1}C_i^t{\star}C_{n+t-i-1}^{t}=\sum_{i=0}^{m}C_i^t{\star}C_{m-i}^t$

RHS=$C_{m+1}^{2t+1}$

等价于证明$\sum_{i=0}^{m}C_i^t{\star}C_{m-i}^t=C_{m+1}^{2t+1}$



下面就是最神奇的地方：

​	设集合D={$1,2,...,m+1$}，从中取出$2t+1$个元素，有$C_{m+1}^{2t+1}$种取法，这$2t+1$个元素也可用如下方式取：

​	先取出元素$i+1$，再在集合{$1,2,...,i$}和{$i+2,i+3,...,,m+1$}中分别取出$t$个元素，也就是$C_i^t{\star}C_{m-i}^t$个取法。

这样就巧妙的利用几何将两个组合数相乘转化为一个组合数。



最后对$i$求和，就得到式子：$\sum_{i=0}^{m}C_i^t{\star}C_{m-i}^t=C_{m+1}^{2t+1}$

证毕。

# Part 3

对这个式子的探究都是期末之前完成的了，这么说来岂不是咕了几个月（

感谢：ZYF，以及帮我联系到ZYF的数竞神仙WZX




