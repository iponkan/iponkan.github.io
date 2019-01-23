---
title: Mac使用
date: 2018-2-2
categories: Mac
tags: 
   - 效率
   - Mac
---

主要总结了一些使用Mac的技巧和环境配置。比较基础。

<!-- more -->

## 安装on my zsh

[MAC安装oh my zsh](http://www.php230.com/mac-install-zsh.html)

## 显示隐藏文件

`defaults write com.apple.finder AppleShowAllFiles -boolean true ; killall Finder`

## 修改mac地址

`sudo ifconfig en0 ether 00:00:00:00:00:00`

其中 en0 是你的第一块网卡（以太网卡，非无线），后面的 12 个 0 是要改成的目标网卡地址。确认后当前机器的网卡地址会临时性生效，当重启后网卡地址又恢复成机器本身的。

## 常用命令

`open .bash_profile`	打开环境变量文件

`source .bash_profile`使修改的环境变量生效

`chmod 777 文件名`修改文件的执行权限

## 文件权限

[mac 查看、修改文件权限的命令](http://blog.csdn.net/x1876631/article/details/70162009)

## Java环境变量和Gradle环境变量

Android Studio已经内置了Java和Gradle，但环境变量需要自己添加

[最详细的mac下Android studio配置gradle的路径](http://blog.csdn.net/u013634213/article/details/51120783)

Java配置亦相同

## 快捷键

Mission control ` ctrl+ up`

## 连接iPhone不自动弹出iTunes

进设备主页，拉到下方，看到那个“连接此iphone时自动同步”的勾了吗？，去掉，再应用一下，就OK了

