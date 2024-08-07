+++
title = "移动硬盘上的arch linux恢复日记(vmlinuz-linux not found)"
thumbnail = 'https://cdn.jsdelivr.net/gh/Fuann-Kinoko/cdn@0.1/posts/21.webp'
date = 2024-08-06
tags = ["记录", "linux"]
description = ""
+++

# 移动硬盘上的arch linux

最近一年, 博主都是在使用一块移动SSD上安装的arch linux

至于原因? 似乎能想到很多:

-   无法割舍游戏体验, 时不时还是要用windows的双系统
-   便携性, 不论是笔记本还是主机都是即插即用
-   硬件发展使得接口宽带已经足够高了
-   就单纯想试试

不论如何, 这不是一个讲如何在移动介质下安装arch linux的博客,
arch linux wiki上也有很详尽的[教程](https://wiki.archlinux.org/title/Install_Arch_Linux_on_a_removable_medium),
这里就不再多谈


# vmlinuz-linux not found

是的, 滚挂了.
不过比想象中的严重一些

连grub 引导项也进不去, 尝试启动只会报错
```bash
Loading Linux linux
error: file ‘/vmlinuz-linux’ not found
Loading initial ramdisk ...
error: you need to load the kernel first
```

这也就意味着有两个可能性:

1.  kernel被损坏, 或者更新过程中真的被搞没了
2.  grub的config文件被搞坏了, 指向文件位置错误

由于之前一直没有出现问题, 只是在一次更新后导致的崩溃, 因此大概率为可能性1.

因为手边没有USB, 只有安装了系统的移动SSD, 因此采用虚拟机恢复:

1.  打开VMWare, 创建新的虚拟机, 光盘选择arch的iso
2.  live boot之后向虚拟机连接上移动硬盘
3.  `fdisk -l` 查看自己的partition
```bash
Device          Start        End    Sectors  Size Type
/dev/sdb1        2048    2099199    2097152    1G EFI System
/dev/sdb2     2099200   35653631   33554432   16G Linux swap
/dev/sdb3    35653632 1923090431 1887436800  900G Linux root (x86-64)
/dev/sdb4  1923090432 3907026943 1983936512  946G Microsoft basic data
```

   可以看到, 我的root文件分区是 `/dev/sdb3`, 而 [ESP](https://wiki.archlinux.org/title/EFI_system_partition) 是 `/dev/sdb1`

1.  分别挂载分区, arch-chroot改变root directory
```bash
mount /dev/sdb3 /mnt
mount /dev/sdb1 /mnt/boot
arch-chroot /mnt
```

1.  进行修复, 这里只是简单的执行了命令 `pacman -Sy linux`
2.  重新生成引导
```bash
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg
```

一般到这里修复也就完成了, 不过针对移动硬盘并不是如此.
当我重新登入时, 出现了严重新问题:

我只是进入了grub的command-line, 不是grub-rescure, 没有任何报错, 但也没有任何引导.
甚至无法通过 `set root=<...>` 和 `set prefix=<...>` 手动进入linux.

为此曾浪费了好几个小时, 直到我想起一件事: 移动硬盘 [根据wiki](https://wiki.archlinux.org/title/GRUB#Installation) 在grub-install时有一个额外的参数: `--removable`,
而这会将grub安装在类似 `/boot/EFI/BOOT/BOOTX64.EFI` 的位置.
如果不带这个参数, 那么grub的安装位置就错了

在虚拟机live boot, 重新执行以上的操作, 带上这个参数后终于能进入系统了

# 后记的nvidia错误

虽然能正确进入系统并且使用无什么大碍, 但启动时提示的另一个报错确实很令人在意:
```bash
failed load kernel modules
```

systemd查看module的报错为, 并不能看出来什么
```bash
❯ systemctl status systemd-modules-load
● systemd-modules-load.service - Load Kernel Modules
     Loaded: loaded (/usr/lib/systemd/system/systemd-modules-load.service; static)
     Active: failed (signal) ...
 Invocation: ...
```

这时想起来, 当初修复问题时, build linux似乎有一个错误:
```bash
Failed to insert module 'nvidia_uvm': Invalid argument
```

以及记得见到过 `mkinitcpio` 时有类似的问题:
```bash
==> ERROR: module not found: 'nvidia'
==> ERROR: module not found: 'nvidia_modeset'
==> ERROR: module not found: 'nvidia_uvm'
==> ERROR: module not found: 'nvidia_drm'
```

那么罪魁祸首就很明显了: 又是nvidia

重装以后就没问题了
