+++
title = 'Post 3 Very Long Title is What you need'
date = 2023-03-15T11:00:00-07:00
draft = false
tags = ['red','green','blue']
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/dragonlady.webp'
+++

Occaecat aliqua consequat laborum ut ex aute aliqua culpa quis irure esse magna dolore quis. Proident fugiat labore eu laboris officia Lorem enim. Ipsum occaecat cillum ut tempor id sint aliqua incididunt nisi incididunt reprehenderit. Voluptate ad minim sint est aute aliquip esse occaecat tempor officia qui sunt. Aute ex ipsum id ut in est velit est laborum incididunt. Aliqua qui id do esse sunt eiusmod id deserunt eu nostrud aute sit ipsum. Deserunt esse cillum Lorem non magna adipisicing mollit amet consequat.

![Bryce Canyon National Park](bryce-canyon.jpg)

Sit excepteur do velit veniam mollit in nostrud laboris incididunt ea. Amet eu cillum ut reprehenderit culpa aliquip labore laborum amet sit sit duis. Laborum id proident nostrud dolore laborum reprehenderit quis mollit nulla amet veniam officia id id. Aliquip in deserunt qui magna duis qui pariatur officia sunt deserunt.
# 前言

由于在Linux环境下没有Total Commander的替代品，于是用上了[ranger](https://github.com/ranger/ranger)。没想到现在回到Windows环境下，居然感觉Ranger比TC还要顺手了

那没办法——只好在WSL环境下装个Ranger凑合用用

（注：我不用[lf](https://github.com/gokcehan/lf)，是因为在我一年前尝试的时候，发现它显示中文有bug）

# 下载安装

不用多说吧，用包管理器就行

# 配置

## 基本使用

### 键位配置

首先先把默认配置拷过来

```sh
ranger --copy-config=all
```
按自己的喜好来改`rc.conf`中的各种键位吧

### Windows中Powershell的调用配置

想要启动倒也简单，直接`wsl ranger`即可

当然太长了打起来麻烦，把这个做成`function`调用更好，放在`$PROFILE`里就能保存成环境变量了

![](https://p.sda1.dev/9/4950d7f140e56ac8ad7ba84faa239526/image.png)

# 技巧1：ranger退出时跳转至对应路径

实话实说，个人用ranger，比起拿它来管理文件，更倾向于用来在各个目录间跳转

一般是这么个流程：`进入ranger->左右hl几下->进入想要的目录->q退出`

本身ranger退出时的跳转实现有几种：

1. **大写S**

    这实际上并不是跳转了目录，而只是在当前目录下又套了一层终端。这时按`<C-d>`退出，只是退回了ranger

    同理，如果此时在新的终端中输入ranger，那就达成了一个`shell->ranger->shell->ranger`的套娃。

    <center>
        <img style="" src="https://p.sda1.dev/9/b8ddf5b17c7535013a078dd634eae96c/image.png" width = "" alt=""/>
        <br>
        <div style="color:orange; border-bottom: 1px solid #d9d9d9;
        display: inline-block;
        color: #999;
        padding: 2px;">
          当你干这种坏事时，ranger也会提醒你进入了一个nested instance
      	</div>
    </center>

    这当然不是我想要的功能，况且叠的还是bash而不是我想用的powershell

2. **利用source**

    实际这个方法也被记录在了[wiki](https://github.com/ranger/ranger/wiki/Integration-with-other-programs#changing-directories)中

    ranger在退出时，实际已经输出了退出前的目录信息。因此利用`source ranger`或者`. ranger`就可以在退出时跳转至退出前的相应目录。

    这个方法很好，解决问题，但是——

    我这个是在powershell调用wsl的ranger，很明显`source wsl ranger`或者`. wsl ranger`没有用，况且，ranger输出的`/mnt/...`路径也不能被windows正确读取

3. **让ranger输出目录路径，处理后读取**

    ranger可以通过指定`choosedir`，退出时将最后的路径保存至一个文件

    那有了路径文件，通过脚本在退出后自动读取路径，转换成Windows可读取的版本，再cd过去就行了

    至于如何转换，wsl2已经在更新后带了一个`wslpath`工具，具体用法可以参考[这里](https://github.com/laurent22/wslpath)

    于是脚本就很好写了

    ```powershell
    function ra{
    	wsl ranger --choosedir=/mnt/c/Users/DELL/ranger_location # 将ranger退出时的路径输出至ranger_location
            wsl --exec wslpath -w $(cat ~\ranger_location) | cd      # 读取ranger_location中的路径，转换成windows路径，在powershell中跳转
    }
    
    ```

    这个方法着实解决了痛点（虽然无聊到套娃用ranger实际上是一个很蠢的举动）
    
    

然后，我发现，问题只是解决了一半……

平时的跳转非常丝滑，没有任何问题

<img src="https://p.sda1.dev/9/2e278b4ebf5bde91463a877780fd6e5b/screenshots.gif" style="zoom:50%;" />



但是一旦路径为中文，就开始报错……

<img src="https://p.sda1.dev/9/55ed1d78372eb7a351daf2433752d491/screenshots.gif" style="zoom:50%;" />



排查了一会儿，发现直到`wsl wslpath (...)`输出的都是正常的，都是一旦经过pipeline就乱码了——

这让本人顿时豁然开朗：原来是祖传UTF-8错误。个人猜测是和这篇[博客](https://blog.darkthread.net/blog/ps-pipeline-exe-encoding/)说的差不多，`wslpath`这个工具没有能力自动切换语系编码，只能统一输出UTF-8

那在脚本开头再加一句就可以了：

```powershell
function ra{
        [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 # 不加这句wslpath只会输出UTF-8，导致在通过pipeline时让中文乱码
        wsl ranger --choosedir=/mnt/c/Users/DELL/ranger_location # 将ranger退出时的路径输出至ranger_location
        wsl --exec wslpath -w $(cat ~\ranger_location) | cd      # 读取ranger_location中的路径，转换成windows路径，在powershell中跳转
}

```

至此跳转问题告一段落

还有一个恼人的细节，在于执行`exe`之后焦点会自动跳转到TOTALCMD上，有时这并不是所需要的

转移焦点到刚刚执行的`Windows Powershell`上：

```powershell
        $wshell = New-Object -ComObject wscript.shell
        $wshell.AppActivate('Windows Powershell') # 焦点转移
```

虽然确实转回来了，但是在`exe`执行完成之前……这导致并没有达到原先想要的效果

要强制在exe结束后执行下一句的话，要利用到一个trick：
```powerhsell
xxx.exe | Out-Null
```
虽然输出到了Null中，但刚好管道本身的特点保证了exe需要执行完毕

于是，最终的版本就是这样：

```powershell
        [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 # 不加这句wslpath只会输出UTF-8，导致在通过pipeline时让中文乱码
        wsl ranger --choosedir=/mnt/c/Users/DELL/ranger_location # 将ranger退出时的路径输出至ranger_location
        wsl --exec wslpath -w $(cat ~\ranger_location) | cd      # 读取ranger_location中的路径，转换成windows路径，在powershell中跳转
        D:\totalcmd\TotalCMD64.exe /O /S $(wsl --exec wslpath -w $(cat ~\ranger_location)) | Out-Null # 通过pipeline trick使得只有执行完exe后才会进入下一句
        $wshell = New-Object -ComObject wscript.shell
        $wshell.AppActivate('Windows Powershell') # 改变focus的窗口
```

# 技巧2：用windows默认程序打开软件

主要参考这篇：[How to launch Windows applications from Ranger in Windows Subsystem for Linux (WSL)](https://gist.github.com/TaipanRex/5db9a19304743fe6367b9ef291d2b69b)

在删掉`rifle.conf`的原有默认配置前提下，复制粘贴以下代码

```shell
ext ods?|xls?|xlsx?|csv?|ics?|vcf?|3dm?|3ds?|max?|bmp?|dds?|gif?|jpg?|jpeg?|png?|psd?|xcf?|tga?|thm?|tif?|tiff?|yuv?|ai?|eps?|ps?|svg?|dwg?|dxf?|gpx?|kml?|kmz?|webp?|3g2?|3gp?|aaf?|asf?|avchd?|avi?|drc?|flv?|m2v?|m4p?|m4v?|mkv?|mng?|mov?|mp2?|mp4?|mpe?|mpeg?|mpg?|mpv?|mxf?|nsv?|ogg?|ogv?|ogm?|qt?|rm?|rmvb?|roq?|srt?|svi?|vob?|webm?|wmv?|yuv?|aac?|aiff?|ape?|au?|flac?|gsm?|it?|m3u?|m4a?|mid?|mod?|mp3?|mpa?|pls?|ra?|s3m?|sid?|wav?|wma?|xm?|7z?|a?|apk?|ar?|bz2?|cab?|cpio?|deb?|dmg?|egg?|gz?|iso?|jar?|lha?|mar?|pea?|rar?|rpm?|s7z?|shar?|tar?|tbz2?|tgz?|tlz?|war?|whl?|xpi?|zip?|zipx?|xz?|pak?|exe?|msi?|bin?|command?|sh?|bat?|crx?|c?|cc?|class?|clj?|cpp?|cs?|cxx?|el?|go?|h?|java?|lua?|m?|m4?|php?|pl?|po?|py?|rb?|rs?|sh?|swift?|vb?|vcxproj?|xcodeproj?|xml?|diff?|patch?|html?|js?|html?|htm?|css?|js?|jsx?|less?|scss?|wasm?|php?|ppt?|odp?|doc?|docx?|ebook?|log?|md?|msg?|odt?|org?|pages?|pdf?|rtf?|rst?|tex?|txt?|wpd?|wps?|mobi?|epub?|azw1?|azw3?|azw4?|azw6?|azw?|cbr?|cbz?| = wslpath -w "$@" | sed -e 's/.*/"&"/' | xargs cmd.exe /C start ""
```







​    
