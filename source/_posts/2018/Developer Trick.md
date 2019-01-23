---
title: Developer Trick
date: 2018-2-2
categories: Android
tags:
   - Android
   - Java
---

总结开发过程中的一些技巧和经验。

<!-- more -->

## FragmentActivity和Activity的区别

fragment是3.0以后的东西，为了在低版本中使用fragment就要用到android-support-v4.jar兼容包,而fragmentActivity就是这个兼容包里面的，它提供了操作fragment的一些方法，其功能跟3.0及以后的版本的Activity的功能一样。
下面是API中的原话：
`FragmentActivity is a special activity provided in the Support Library to handle fragments on system versions older than API level 11. If the lowest system version you support is API level 11 or higher, then you can use a regular Activity.`

1. fragmentactivity 继承自activity，用来解决android3.0 之前没有fragment的api，所以在使用的时候需要导入support包，同时继承fragmentActivity，这样在activity中就能嵌入fragment来实现你想要的布局效果。 
2. 当然3.0之后你就可以直接继承自Activity，并且在其中嵌入使用fragment了。 
3. 获得Manager的方式也不同 

3.0以下：getSupportFragmentManager() 
3.0以上：getFragmentManager()

## ANR

1. 拉出anr文件夹

`adb pull /data/anr  C:\a`

2. 确实有一些ANR问题很难调查清楚，因为整个系统不稳定的因素很多，例如Linux Kernel本身的bug引起的内存碎片过多、硬件损坏等。这类比较底层的原因引起的ANR问题往往无从查起，并且这根本不是应用程序的问题，浪费了应用开发人员很多时间，如果你从事过整个系统的开发和维护工作的话会深有体会。所以我不能保证了解了本章的所有内容后能够解决一切ANR问题，如果出现了很疑难的ANR问题，我建议最好去和做驱动和内核的朋友聊聊，或者，如果问题只是个十万分之一的偶然现象，不影响程序的正常运行，我倒是建议不去理它。

## 开发者选项

- 动画时长

控制动画执行的时长

## Android之倒计时验证两种常用方式

1. CountDownTimer
2. Handler(Thread Sleep 方式)

## 相关链接

[Android小技巧(1)](http://androidperformance.com/2014/05/28/android-tips-round-up-1.html)

[很少有人会告诉你的Android开发基本常识](http://zmywly8866.github.io/2014/12/12/android-develop-experience-can-not-learn-from-school.html)

[Android多分辨率适配经验总结](http://zmywly8866.github.io/2015/03/04/android-multi-resolution-adaptation.html)

[Android布局技巧：使用TextView的drawable属性](http://toughcoder.net/blog/2015/05/20/android-layout-trick-drawable-of-textview/)

[利用 Android Annotations 来玩玩契约编程](http://blog.csdn.net/feelang/article/details/49000203)

[android Palette使用详解](http://blog.csdn.net/xiaochuanding/article/details/72983772)





