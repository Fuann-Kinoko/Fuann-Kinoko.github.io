+++
title = "NOI2018 归程 题解"
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/noi_return.webp'
date = 2019-11-07
tags = ["OI"]
description = "可持久化并查集"
+++
## 题目信息

丢[传送门](https://www.luogu.org/problem/P4768)

## 题解

### 65%

很容易想到离线做法：

将边按权值从高到低排序，丢进并查集处理。同时将询问离线，按水位线从高到低。

并查集维护当前水位下没有积水的连通块，以及块中离1号点最近的距离。当然，还得跑个单源最短路来求距离。由于水位线是在递减，并查集不会有删除操作,说明这样做是正确的。

然而这题强制在线……

### 100%

我们发现并查集处理不了这道题

但是

可持久化并查集可以……

可持久化并查集可以用【可持久化数组+并查集】理解，可持久化数组可以用【可持久化线段树】理解，可持久化线段树也就是非权值线段树版【主席树】。于是正解的思路就出来了。

同65%的加边操作，只是每条边加完以后记录版本。查询时访问对应的版本，求出点所在连通块到1号点的最小距离。



不过这题恶心的地方在代码和一些细节。调了2个小时，如果真在考场上肯定写完65%走人。



注意：

- 海拔需要离散
- 并查集不能路径压缩，不然空间会爆。需要按秩合并。按秩合并相当于启发式合并，深度小的合并到深度大的上。这里又会引出一个细节——当两个根深度相同，需要人为给合并后的那个深度加一以保证正确性。



我这里更新后的块内最小距离是记录到根编号上，比较神秘。据说开个真的并查集，用可持久化数组记录变化要快很多，有兴趣的可以尝试一下。



3.47K AC：

```c++
#include <bits/stdc++.h>
#define mp make_pair
#define mem(O) memset(O,0,sizeof(O))
using namespace std;
typedef long long ll;
typedef pair<int,int> P;

inline char nc(){
	#ifdef nijisanji
		return getchar();
	#endif
    static char buf[100000],*p1=buf,*p2=buf;
    return p1==p2&&(p2=(p1=buf)+fread(buf,1,100000,stdin),p1==p2)?EOF:*p1++;
}
inline int red(){
	int x=0,f=1;char ch=nc();for(;!isdigit(ch);ch=nc())if(ch=='-')f=-1;
	for(;isdigit(ch);ch=nc())x=x*10+ch-'0';return x*f;
}

const int N = 5e5+10;

int n,m,p;
int lis[N];

struct edge{int u,v,w,h,nxt;}e[N<<1],E[N];
int head[N],add_cnt;
inline void add(int u,int v,int w){e[++add_cnt]=(edge){u,v,w,0,head[u]};head[u]=add_cnt;}
bool cmp(edge a,edge b){return a.h>b.h;}

int rt[N],fa[N<<5],dep[N<<5];ll mn[N<<5];

namespace SHR{
	ll dis[N];int vis[N];
	void dijkstra(){
		memset(dis,0x3f,sizeof(dis));
		priority_queue <P,vector<P>,greater<P> > q;
		dis[1]=0,q.push(mp(dis[1],1));
		while(!q.empty()){
			int u=q.top().second;q.pop();
			if(vis[u])	continue;vis[u]=1;
			for(int i=head[u];i;i=e[i].nxt){
				int v=e[i].v;
				if(dis[v]>dis[u]+e[i].w){
					dis[v]=dis[u]+e[i].w;
					q.push(mp(dis[v],v));
				}
			}
		}
	}
}

namespace HJT{
	int sz,ls[N<<5],rs[N<<5];
	#define mid (tl+tr>>1)
	void build(int &o,int tl,int tr){
		o=++sz;
		if(tl==tr)	return fa[o]=tl,mn[o]=SHR::dis[tl],dep[o]=0,void();
		build(ls[o],tl,mid),build(rs[o],mid+1,tr);
	}
	void herige(int &o,int per,int tar,int tl,int tr){
		o=++sz;
		ls[o]=ls[per],rs[o]=rs[per];
		if(tl==tr){fa[o]=fa[per],dep[o]=dep[per],mn[o]=mn[per];return;}
		if(tar<=mid)	herige(ls[o],ls[per],tar,tl,mid);
		else			herige(rs[o],rs[per],tar,mid+1,tr);
	}
	void merge(int &o,int per,int tar,int tl,int tr,int f){
		o=++sz;
		ls[o]=ls[per],rs[o]=rs[per];
		if(tl==tr){fa[o]=f,dep[o]=dep[per],mn[o]=mn[per];return;}
		if(tar<=mid)	merge(ls[o],ls[per],tar,tl,mid,f);
		else			merge(rs[o],rs[per],tar,mid+1,tr,f);
	}
	void update(int o,int tar,int tl,int tr){
		if(tl==tr)	return ++dep[o],void();
		if(tar<=mid)	update(ls[o],tar,tl,mid);
		else			update(rs[o],tar,mid+1,tr);
	}
	int query(int o,int tar,int tl,int tr){
		if(tl==tr)	return o;
		if(tar<=mid)	return query(ls[o],tar,tl,mid);
		else			return query(rs[o],tar,mid+1,tr);
	}
	#undef mid
}

namespace UDF{
	int find(int o,int tar){
		int u=HJT::query(o,tar,1,n);
		if(fa[u]==tar)	return u;
		return find(o,fa[u]);
	}
	void merge(int x,int y,int i){
		int fx=find(rt[i],x),fy=find(rt[i],y);
		if(fa[fx]!=fa[fy]){
			if(dep[fx]>dep[fy])	swap(fx,fy);
			HJT::merge(rt[i],rt[i-1],fa[fx],1,n,fa[fy]);
			HJT::herige(rt[i],rt[i],fa[fy],1,n);
			int py=HJT::query(rt[i],fa[fy],1,n);
			int px=HJT::query(rt[i],fa[fx],1,n);
			mn[py]=min(mn[py],mn[px]);
			if(dep[fx]==dep[fy])	HJT::update(rt[i],fa[fy],1,n);
		}
	}
}

void discrete(){
	sort(E+1,E+m+1,cmp);
	for(int i=1;i<=m;++i)	lis[i]=E[m-i+1].h;
}

ll lastans=0;

void solve(){
	n=red(),m=red();
	for(int i=1;i<=m;++i){
		int u=red(),v=red(),l=red(),a=red();
		add(u,v,l),add(v,u,l);
		E[i]=(edge){u,v,l,a,0};
	}
	SHR::dijkstra();
	discrete();
	HJT::build(rt[0],1,n);
	for(int i=1;i<=m;++i){
		rt[i]=rt[i-1];
		UDF::merge(E[i].u,E[i].v,i);
	}
	ll Q=red(),K=red(),S=red();
	for(int i=1;i<=Q;++i){
		ll u=(red()+K*lastans-1)%n+1;
		ll pl=(red()+K*lastans)%(S+1);
		int ver=m-(upper_bound(lis+1,lis+m+1,pl)-lis)+1;
		lastans=mn[UDF::find(rt[ver],u)];
		printf("%lld\n",lastans);
	}
}

void clear(){
	mem(SHR::vis),mem(rt),mem(head);
	add_cnt=0,HJT::sz=0,lastans=0;
}

int main(){
	int T=red();
	while(T--){
		solve();
		if(T) clear();
	}
	return 0;
}
```


