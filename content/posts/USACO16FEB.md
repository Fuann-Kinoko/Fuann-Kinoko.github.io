+++
title = "USACO16FEB Load Balancing Platinum 题解"
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/ribuyuuki/ribuyuuki8.webp'
date = 2019-10-21
tags = ["OI"]
description = "USACO16FEB SILVER 平衡树 二分 题解"
+++
传送门：[Load Balancing_Silver](https://www.luogu.org/problem/P3138) 

传送门的题面虽然是Silver，但和Platinum的区别也只在数据范围，所以看题面看水谷就行了。Platinum的数据范围是1E5，此解法也可AC

看了一眼题，先敲了60行splay，再认真看题……卧槽根本不用平衡树。但是既然都写了……不用就太吃亏了。这里就写下平衡树解法吧。

首先标准的二分，看不出来请自裁。令x线指与y轴平行的线，y线指与x轴平行的线。我们发现不能二分套二分的来求x线和y线，因为这两个在一起并不满足单调性。

看一下数据范围，如果是$Nlog(N)$或者$Nlog^2(N)$应该还是能够接受的。考虑枚举x线，二分y线，这时候我们需要的就是两棵平衡树，L存着在x线左侧的所有点的y坐标，另一棵R存着在x线右侧的所有点的y坐标。每次x线向后移时，只需要在L中插入一些，在R中删除一些即可。

至于为什么二分y线就是满足单调的呢？这点稍微画下图就能明白。check的条件也就是


```c++
if max(左下，右下)<=max(左上，右上)
   then l=mid+1
   else r=mid
```

然后稍微注意一下代码细节。如果直接二分x线权值我们不好让mid全为偶数。注意到题目并没有让我们输出x线y线，我们可以改为二分最后一个小于等于x线权值的点的横坐标。



AC代码：

```c++
#include <bits/stdc++.h>
using namespace std;

inline int red(){
	int x=0,f=1;char ch=getchar();for(;!isdigit(ch);ch=getchar())if(ch=='-')f=-1;
	for(;isdigit(ch);ch=getchar())x=x*10+ch-'0';return x*f;
}

const int N = 1e5+10;
const int INF = 0x3f3f3f3f;

int n,res=INF,ans=INF;
int ypos[N];

struct point{int x,y;}p[N];
bool cmp(point a,point b){return a.x<b.x;}

namespace Splay{
	struct S{
		int ch[N][2],fa[N],sze[N],cnt[N],val[N];
		int root,tot;
		#define ls(A) ch[A][0]
		#define rs(A) ch[A][1]
		void pushup(int x){sze[x]=sze[ls(x)]+sze[rs(x)]+cnt[x];}
		void conect(int a,int p,int b){ch[a][p]=b,fa[b]=a;}
		void rotate(int x){
			int y=fa[x],z=fa[y],k=(rs(y)==x),w=(rs(z)==y);
			conect(z,w,x),conect(y,k,ch[x][k^1]),conect(x,k^1,y);
			pushup(y),pushup(x);
		}
		void splay(int x,int s){
			while(fa[x]!=s){
				int y=fa[x],z=fa[y],k=(ls(y)==x),w=(ls(z)==y);
				if(z!=s)	rotate(k==w?y:x);
				rotate(x);
			}
			if(!s)	root=x;
		}
		void insert(int tar){
			int x=root,y=0;
			while(x&&val[x]!=tar)	y=x,x=ch[x][tar>val[x]];
			if(x)	{++cnt[x],splay(x,0);return;}
			x=++tot;
			if(y)	ch[y][tar>val[y]]=x;
			fa[x]=y,sze[x]=cnt[x]=1,val[x]=tar;
			splay(x,0);
		}
		void find(int tar){		
			int x=root;if(!root)	return;
			while(ch[x][tar>val[x]]&&val[x]!=tar)	x=ch[x][tar>val[x]];
			splay(x,0);
		}
		int drive(int tar,int f){
			find(tar);int x=root;
			if(val[x]>tar&&f)	return x;
			if(val[x]<tar&&!f)	return x;
			x=ch[x][f];
			while(ch[x][f^1])	x=ch[x][f^1];
			return x;
		}
		void dereta(int tar){
			int per=drive(tar,0),net=drive(tar,1);
			splay(per,0),splay(net,per);	
			int del=ls(net);
			if(cnt[del]>1)	--cnt[del],splay(del,0);
			else	ls(net)=0;
		}
		int num(int tar){
			find(tar);
			return sze[ls(root)]+cnt[root];
		}
		int sum(){return sze[ls(root)]+sze[rs(root)]+cnt[root];}
	}s[2];
}

//ld=left down lu=left up rd=right down ru=right up
int check(int mid,int x){
	int per=Splay::s[0].num(ypos[mid])-1,net=Splay::s[1].num(ypos[mid])-1;
	int lef=Splay::s[0].sum()-2,rig=Splay::s[1].sum()-2;
	int ld=per,lu=lef-ld,rd=net,ru=rig-rd;
	if(max(ld,rd)<=max(lu,ru))	return res=min(res,max(lu,ru)),1;
	return 0;
}

int main(){
	n=red();
	for(int i=1;i<=n;++i)
		p[i].x=red(),p[i].y=ypos[i]=red();
	sort(p+1,p+n+1,cmp);sort(ypos+1,ypos+n+1);
	Splay::s[0].insert(-1e9),Splay::s[0].insert(1e9);
	Splay::s[1].insert(-1e9),Splay::s[1].insert(1e9);
	for(int i=1;i<=n;++i)	Splay::s[1].insert(p[i].y);
	for(int i=1,cnt=1;i<=n;++i){
		while(p[cnt].x<=p[i].x&&cnt<=n)	Splay::s[0].insert(p[cnt].y),Splay::s[1].dereta(p[cnt++].y);
		int l=1,r=n;res=INF;
		while(l+1<=r){
			int mid=l+r>>1;
			if(check(mid,cnt-1))	l=mid+1;
			else					r=mid;
		}
		ans=min(ans,res);
	}
	printf("%d",ans);
	return 0;
}
```


