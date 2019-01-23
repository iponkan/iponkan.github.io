---
title: 反编译apk
date: 2018-2-28
categories: Android
tags:
   - Android
   - 反编译
---

Android反编译记录。这里只记录反编译查看源代码的方法。反编译得到资源文件请自行Google。
<!-- more -->

## 准备工具

- The Unarchiver   专业解压缩工具


- JD-GUI 反编译后代码查看工具

  [下载地址](https://github.com/java-decompiler/jd-gui/releases/)

- dex2jar dex反编译为jar工具

  [下载地址](https://github.com/java-decompiler/jd-gui/releases/)


## 步骤(Mac环境)

1. 将apk后缀改为rar，解压

不要改成zip，mac解压zip会出问题，采用The Unarchiver 解压。会解压出一个classes.dex文件。

2. 定位到dex2jar文件夹下

执行`sh d2j-dex2jar.sh /Users/username/xxx/classes.dex`

3. 如出现错误：`d2j-dex2jar.sh: line 36: ./d2j_invoke.sh: Permission denied`则执行

`sudo chmod +x d2j_invoke.sh`

4. 将生成的classes-dex2jar.jar拖入JD-GUI