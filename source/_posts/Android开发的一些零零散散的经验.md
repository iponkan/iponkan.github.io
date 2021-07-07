---
title: Android开发的一些零零散散的经验
date: 2019-6-12
categories: Android
tags:
   - Android

---

# 依赖库的引入

aar是有依赖树的，避免使用依赖树很多的aar，可以在pom文件查看，比如Google的Guava就很大

# 搭建通过的网络框架

封装线程，对请求进行统一处理，重试等机制

# Fragment使用

 多使用fragment来呈现ui试图，使用activity只是为了管理Fragment

#  样式

 可以整合styles来避免使用重复的属性，使用多个style文件来避免单一的一个大style文件。

[Android样式的开发:shape篇](http://keeganlee.me/post/android/20150830)

[Android样式的开发:selector篇](http://keeganlee.me/post/android/20150905)

[Android样式的开发:layer-list篇](http://keeganlee.me/post/android/20150909)

[Android样式的开发:drawable汇总篇](http://keeganlee.me/post/android/20150916)

[Android样式的开发:View Animation篇](http://keeganlee.me/post/android/20151003)

[Android样式的开发:Property Animation篇](http://keeganlee.me/post/android/20151026)

[Android样式的开发:Style篇](http://keeganlee.me/post/android/20151031)

#  配置位置

可以将密码配置等放在local.properties文件中，如果代码放在GitHub上

# 抓包

Windows用Fiddler抓包，Mac用的是Chales，靠的是代理的方式，专门用来捕获HTTP，HTTPS的。

*备注*

*wireshark能获取HTTP，也能获取HTTPS，但是不能解密HTTPS，所以wireshark看不懂HTTPS中的内容。*

*总结，如果是处理HTTP,HTTPS 还是用Fiddler, 其他协议比如TCP,UDP 就用wireshark。*

# 快速安装apk

可以简单写个脚本，双击apk自动安装到手机上，我自己写的Windows脚本，可以参考下 [install.bat](https://gist.github.com/iponkan/2c655d3cbe93f2b63a229b1cf5f42578)

思想是利用adb命令和批处理来安装apk，在windows上可以直接指定apk的安装方式为install.bat,实现快速安装

# 隐藏API

首先要明白为什么隐藏API（有@hide标记）和Internal包不能使用。

当我们使用android的SDK进行开发的时候都会用到一个非常重要的jar文件--android.jar（SDK_DIR/platforms /platform-X/android.jar，X是API等级）。这个包中移除了所有被标记的尾@hide的类、方法、枚举、字段和Internal 包。当我们的程序在设备上运行的时候会加载设备上的一个framework.jar的文件，它包含了移除的部分

# Gradle和Gradle插件

因为Ｇradle仍在发展，在不断更新，自然Ｇradle插件也需要不断更新版本才能提供对新版本Ｇradle的支持，那么它们之间的版本是如何对应的呢？

官网链接[Android Gradle 插件版本说明](https://developer.android.com/studio/releases/gradle-plugin?hl=zh-cn)展示了Gradle插件与Gradle版本间更新的对应关系.顺便说一下,最好让你的Gradle和Gradle插件都更新到最新.

补充：

*gradle-wrapper.properties*中配置的是的**Gradle**的版本.

*build.gradle*中的依赖指定的是**Gradle插件**的版本.

# 动画

## AnimatorSet和AnimationSet

AnimationSet 我们最常用的是调用其 addAnimation 将一个个不一样的动画组织到一起来，然后调用view 的 startAnimation 方法触发这些动画执行。功能较弱不能做到把集合中的动画按一定顺序进行组织然后在执行的定制。

AnimatorSet 我们最常用的是调用其play、before、with、after 等方法设置动画的执行顺序，然后调用其start 触发动画执行。

AnimationSet 与 AnimatorSet 最大的不同在于，AnimationSet 使用的是 Animation 子类、AnimatorSet 使用的是 Animator 的子类。

Animation 是针对视图外观的动画实现，动画被应用时外观改变但视图的触发点不会发生变化，还是在原来定义的位置。

Animator  是针对视图属性的动画实现，动画被应用时对象属性产生变化，最终导致视图外观变化。

# PopupWindow

PopupWindow显示的方法有三个,showAsDropDown(anchor),showAsDropDown(anchor, xoff, yoff)和showAtLocation(parent, gravity, x, y)。
前两个showAsDropDown方法是让PopupWindow相对于某个控件显示，而showAtLocation是相对于整个窗口的。
第一个参数是View类型的parent,虽然这里参数名是parent，其实，不是把PopupWindow放到这个parent里，并不要求这个parent是一个ViewGroup，这个参数名让人误解。官方文档”a parent view to get the android.view.View.getWindowToken() token from
“,这个parent的作用应该是调用其getWindowToken()方法获取窗口的Token,所以，只要是该窗口上的控件就可以了。
第二个参数是Gravity，可以使用|附加多个属性，如Gravity.LEFT|Gravity.BOTTOM。
第三四个参数是x,y偏移。

# 广播的使用

优先使用LocalBroadcastManager管理本地广播。

## BroadcastReceiver安全问题

BroadcastReceiver设计的初衷是从全局考虑可以方便应用程序和系统、应用程序之间、应用程序内的通信，所以对单个应用程序而言BroadcastReceiver是存在安全性问题的(恶意程序脚本不断的去发送你所接收的广播)。为了解决这个问题LocalBroadcastManager就应运而生了。

[Android LocalBroadcastManager 的使用总结](https://www.cnblogs.com/zhaoyanjun/p/6048369.html)

# 滤镜相机的开发

[android-gpuimage](https://github.com/CyberAgent/android-gpuimage)

[Android OpenGL开发实践 - GLSurfaceView对摄像头数据的再处理](https://mp.weixin.qq.com/s/R1QcicC14TYNnxJ4s-8SEw)

[android-gpuimage-plus](https://github.com/wysaid/android-gpuimage-plus)

[Android 高性能图形处理 之 二. OpenGL ES](http://tangzm.com/blog/?p=20)

[Android相机开发系列](https://www.polarxiong.com/archives/Android%E7%9B%B8%E6%9C%BA%E5%BC%80%E5%8F%91%E7%B3%BB%E5%88%97.html)

# ANR

确实有一些ANR问题很难调查清楚，因为整个系统不稳定的因素很多，例如Linux Kernel本身的bug引起的内存碎片过多、硬件损坏等。这类比较底层的原因引起的ANR问题往往无从查起，并且这根本不是应用程序的问题，浪费了应用开发人员很多时间，如果你从事过整个系统的开发和维护工作的话会深有体会。所以我不能保证了解了本章的所有内容后能够解决一切ANR问题，如果出现了很疑难的ANR问题，我建议最好去和做驱动和内核的朋友聊聊，或者，如果问题只是个十万分之一的偶然现象，不影响程序的正常运行，我倒是建议不去理它。

# 开发者选项

- 打开GPU过度绘制开关查看过度绘制区域

- 可以控制动画执行的时长

# 屏幕适配

[Android多分辨率适配经验总结](http://zmywly8866.github.io/2015/03/04/android-multi-resolution-adaptation.html)

# 依赖分析

可以用gradle命令分析依赖

./gradlew :app:dependencies 