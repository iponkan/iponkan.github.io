---
title: Android踩坑之旅
date: 2018-1-2
categories: Android
tags: 
   - Android
   - SeerBar
---

记录Android踩坑之旅。

<!-- more -->

## PhoneWindow

layout最外层宽高无效



## Android透明度对应的数值

| 透明度  | 数值   |
| ---- | ---- |
| 100% | FF   |
| 95%  | F2   |
| 90%  | E6   |
| 85%  | D9   |
| 80%  | CC   |
| 75%  | BF   |
| 70%  | B3   |
| 65%  | A6   |
| 60%  | 99   |
| 55%  | 8C   |
| 50%  | 80   |
| 45%  | 73   |
| 40%  | 66   |
| 35%  | 59   |
| 30%  | 4D   |
| 25%  | 40   |
| 20%  | 33   |
| 15%  | 26   |
| 10%  | 1A   |
| 5%   | 0D   |
| 0%   | 00   |

## 自定义SeekBar

[Android 自定义SeekBar以及几个要注意的问题](http://www.voidcn.com/article/p-tvegcwnq-bcx.html)

## WebView

[android WebView详解，常见漏洞详解和安全源码（上）](http://blog.csdn.net/self_study/article/details/54928371)

[android WebView详解，常见漏洞详解和安全源码（下）](http://blog.csdn.net/self_study/article/details/55046348)

## ViewPager

[ViewPager 切换效果](http://www.lightskystreet.com/2014/12/15/viewpager-anim/)

## 动画

### AnimatorSet和AnimationSet

AnimationSet 我们最常用的是调用其 addAnimation 将一个个不一样的动画组织到一起来，然后调用view 的 startAnimation 方法触发这些动画执行。功能较弱不能做到把集合中的动画按一定顺序进行组织然后在执行的定制。

AnimatorSet 我们最常用的是调用其play、before、with、after 等方法设置动画的执行顺序，然后调用其start 触发动画执行。

AnimationSet 与 AnimatorSet 最大的不同在于，AnimationSet 使用的是 Animation 子类、AnimatorSet 使用的是 Animator 的子类。

Animation 是针对视图外观的动画实现，动画被应用时外观改变但视图的触发点不会发生变化，还是在原来定义的位置。

Animator  是针对视图属性的动画实现，动画被应用时对象属性产生变化，最终导致视图外观变化。

## PopupWindow showAtLocation用法

PopupWindow显示的方法有三个,showAsDropDown(anchor),showAsDropDown(anchor, xoff, yoff)和showAtLocation(parent, gravity, x, y)。
前两个showAsDropDown方法是让PopupWindow相对于某个控件显示，而showAtLocation是相对于整个窗口的。
第一个参数是View类型的parent,虽然这里参数名是parent，其实，不是把PopupWindow放到这个parent里，并不要求这个parent是一个ViewGroup，这个参数名让人误解。官方文档”a parent view to get the android.view.View.getWindowToken() token from
“,这个parent的作用应该是调用其getWindowToken()方法获取窗口的Token,所以，只要是该窗口上的控件就可以了。
第二个参数是Gravity，可以使用|附加多个属性，如Gravity.LEFT|Gravity.BOTTOM。
第三四个参数是x,y偏移。

## Android Support 包

## Android中的硬件加速

[Android中的硬件加速](https://my.oschina.net/tingzi/blog/158196)

## MultiDex

[MultiDex工作原理分析和优化方案](http://kaedea.com/2016/11/11/android/multidex-source-code/index.html)

## Android Developer Tools

[Android Developer Tools（开发人员工具）](http://yanghui.name/blog/2015/01/20/android-developer-tools)

## 隐藏API

首先我们要明白为什么隐藏API（有@hide标记）和Internal包不能使用。

当我们使用android的SDK进行开发的时候都会用到一个非常重要的jar文件--android.jar（SDK_DIR/platforms /platform-X/android.jar，X是API等级）。这个包中移除了所有被标记的尾@hide的类、方法、枚举、字段和Internal 包。当我们的程序在设备上运行的时候会加载设备上的一个framework.jar的文件，它包含了移除的部分

## Gradle和Gradle插件

因为Ｇradle仍在发展，在不断更新，自然Ｇradle插件也需要不断更新版本才能提供对新版本Ｇradle的支持，那么它们之间的版本是如何对应的呢？

下图展示了Gradle插件与Gradle版本间更新的对应关系.顺便说一下,最好让你的Gradle和Gradle插件都更新到最新.

| Plugin version | Required Gradle version |
| -------------- | ----------------------- |
| 1.0.0 - 1.1.3  | 2.2.1 - 2.3             |
| 1.2.0 - 1.3.1  | 2.2.1 - 2.9             |
| 1.5.0          | 2.2.1 - 2.13            |
| 2.0.0 - 2.1.2  | 2.10 - 2.13             |
| 2.1.3+         | 2.14.1+                 |

## 总结

*gradle-wrapper.properties*中配置的是的**Gradle**的版本.

*build.gradle*中的依赖指定的是**Gradle插件**的版本.

## Android的Context

### Context结构

Context 类本身是一个纯 abstract 类，他有两个具体的实现子类：ContextImpl 和ContextWrapper。其中 ContextWrapper 类，只是一个包装而已，可以理解为装饰模式或者静态代理模式，whatever。

ContextWrapper构造函数中必须包含一个真正的 Context 引用，同时 ContextWrapper 提供了attachBaseContext（）用于给 ContextWrapper 对象中指定真正的 Context 对象，调用 ContextWrapper 的方法都会被转向其所包含的真正的 Context 对象。

```java
 @Override
    public AssetManager getAssets() {
        return mBase.getAssets();
    }

    @Override
    public Resources getResources() {
        return mBase.getResources();
    }
```

而 ContextImpl 类则真正实现了 Context 中的所有函数，应用程序中所调用的各种Context 类的方法，其实现均来于该类。Context 的两个子类分工明确，其中ContextImpl 是 Context 的具体实现类，ContextWrapper 是 Context 的包装类。

ContextImpl 直接用类查找的方式在Studio查找不出来，使用具体搜索的时候可以搜索出来。

### 获取 Context

1）View.getContext,返回当前 Activity 所在的应用进程的 Context 对象，通常是当前正在展示的 Activity 对象

2）getApplication 和 getApplicationContext 获取的对象时一致的。但是getApplication 方法只有在 Activity 和 Service 中才能调到。但例如BroadcasrReceiver 中需要获取 Application，则需要借助 getApplicationContext（） 方法。

## 相关链接

[android:process 的坑，你懂吗？](http://www.rogerblog.cn/2016/03/17/android-proess/)

[理解Android进程创建流程](http://gityuan.com/2016/03/26/app-process-create/)







