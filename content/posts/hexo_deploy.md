+++
title = "Hexo 建站指北"
tags = ["记录"]
date = 2019-10-15
description = ""
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/others/shina.webp'
+++
## 前言



搭建是在Windows环境下进行

本搭建记录仅供参考，具体各种实现可自行研究。


## 目录



- 前置安装
- github绑定及部署
- 主题配置
- 主题修改
- 文章相关
- 图片相关



## 正文



### 一，前置安装

#### 1.安装Git Bash与NodeJS

CLI环境安装。虽然实际上用powershell输入命令行也可以, 不过这里仍然介绍一下windows环境下git bash的安装。

##### ①Git Bash安装

- [下载地址](https://git-for-windows.github.io/)
- 安装步骤：双击exe，一路点击next

##### ②NodeJs安装

- [下载地址](https://nodejs.org/en/)
- 安装步骤：一路next。记得在Custom Setup这部选【Add to Path】

#### 2.下载hexo并安装hexo

- 创建新文件夹，cd（移动）到该文件夹下  （示例 : ``cd F:\MyHexo``）
- 输入npm i -g hexo进行安装
- 耐心等待
- 成功后，可输入 ``hexo -v`` 查看版本
- 在Bash中输入``hexo init``进行初始化

### 二，github绑定及部署

首先，这里默认拥有github账号……没有的注册一个就行了。**以下图片多引用自网络。**

#### 1.搭桥到github

- 创建一个repo，命名规则严格遵守 ``yourname.github.io`` 否则无效

- ![](https://visugar.oss-cn-shenzhen.aliyuncs.com/article/setuphexo/new-repo.png)

- ![](https://visugar.oss-cn-shenzhen.aliyuncs.com/article/setuphexo/create-repo.png)

- 回到Git Bash，配置github账户信息

  - ``git config --global user.name "xx"``
  - ``git config --global user.email "xx"``
  - ``xx``  请自行替换

- 创建SSH

  - 输入``ssh-keygen -t rsa -C "youremail@example.com"``
  - ``youremail@example.com`` 部分请自行替换
  - 如果提示要输入passphrase，直接回车
  - 输入``clip < ~/.ssh/id_rsa.pub``,这时SSH已经被拷贝了
  - 将获取的SSH放入github中

  - ![](https://visugar.oss-cn-shenzhen.aliyuncs.com/article/setuphexo/settings.png)

  - ![](https://visugar.oss-cn-shenzhen.aliyuncs.com/article/setuphexo/ssh-key.png)
  - 点击``New SSH key``,title随便取，key框内直接粘贴
  - ![](https://i.loli.net/2018/10/17/5bc6aab3bea21.jpg)
  - 验证是否成功，gitbash中输入``ssh -T git@github.com``
  - ![](https://i.loli.net/2018/10/17/5bc6aac1546c4.jpg)

#### 2.本地配置

- 修改文件夹中``_config.yml``的部分内容
- 注意：所有冒号后还得加一个半角空格

```
deploy:
  type: git
  repo: https://github.com/YourgithubName/YourgithubName.github.io.git
  branch: master
```

- 输入 ``hexo clean && hexo g && hexo s`` 进行本地运行
- 如果在 localhost:4000中可以看见自己博客，那就成功了

![](https://i.loli.net/2018/10/17/5bc6aa332c7b8.jpg)

- 再次键入``hexo clean && hexo g && hexo d``
- 在浏览器中输入``http://yourgithubname.github.io``
- 正确操作的话应该能访问到博客主页

### 三，主题配置

主题的选择很多，博主这里自己使用的是Hexo Sakura主题

- [下载地址](https://github.com/honjun/hexo-theme-sakura)

说明文档中有主题配置的详尽介绍，如使用Next主题等可以参考其它博客

### 四，主题修改

简单记录一下自己进行的主题修改, 不过相对基础就是了

这种修改方式多适用于做减法，不适用于做加法

- 在浏览器中打开开发者工具 （如chrome F12）
- 对想要进行的部分进行定位 （也可利用右键检查）
- 如这里，想要修改【番组计划】旁的字
- ![1571240318384](https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/19_10_17/1.png)
- ![1571240348758](https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/19_10_17/2.png)
- 打开博客目录->themes->Sakura->layout文件夹，寻找存在这一段的文件。对于这里的修改，可以在``bangumi.ejs``中找到
- ![1571240572853](https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/19_10_17/3.png)
- 在此处修改即可
- 当然，也有不少东西是存放在css文件中的，在Styles中根据灰色提示就可定位到什么文件与多少行了。修改方式同理。

### 五，文章相关

#### 1.新建文章

- 输入``hexo new "文件title" ``来以调用模板的形式新建一篇文章
- 使用markdown编辑

#### 2.修改模板

- 模板在scaffolds->post.md，自行修改即可

#### 3.启用数学公式

- 在模板最后一行加入``mathjax: true``即可，前提：使用的主题有预载
- 注意hexo部分数学公式显示会有问题，这时可以尝试转义（如：写矩阵时``//``需转义成``////``）

#### 4.启用gitalk评论区

- [具体链接](https://yremp.live/hexo-sakura-install-gitalk/)

- 这里再补充一个可能会遇到的问题：出现``Error: Validation Failed``。报错原因是地址超过50字节限制。网上的解决方法大多是进行MD5 hash。其实还有个偷懒的办法，就是修改md文件的名称，将其改为序号，一般就不会超出限制了。





<center>待更新……</center>

