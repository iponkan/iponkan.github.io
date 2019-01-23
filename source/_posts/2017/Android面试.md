---
title: Android面试
date: 2017-1-5
categories: Android
tags:
   - Android
   - 面试
---

面试经验整理。

<!-- more -->

## 常见问题

- 简述App进程的生命周期，包括何时创建、怎样创建、如何销毁
- 简述View动画与属性动画的区别
- 如何实现如下布局效果：一个Button在一行中居中显示，且Button宽度为屏幕宽度的一半
- Android中如何进行线程间通信
- Service的不同启动方式与区别
- 至少列举两种Android开发或其源码中用到的设计模式
- 详细阐述Android消息机制
- 关于Android性能优化方面的思考
- 详细阐述Android消息机制
  这是我们招聘Android开发时的几个问题，可以参考下，比较注重基础及深度，不在乎你用没用过一些潮流的第三方库

## Android常见问题

Android

1. Activity与Fragment的生命周期。
2. Acitivty的四中启动模式与特点。
3. Activity缓存方法。
4. Service的生命周期，两种启动方法，有什么区别。
5. 怎么保证service不被杀死。
6. 广播的两种注册方法，有什么区别。
7. Intent的使用方法，可以传递哪些数据类型。
8. ContentProvider使用方法。
9. Thread、AsycTask、IntentService的使用场景与特点。
10. 五种布局： FrameLayout 、 LinearLayout 、 AbsoluteLayout 、 RelativeLayout 、 TableLayout 各自特点及绘制效率对比。
11. Android的数据存储形式。
12. Sqlite的基本操作。
13. Android中的MVC模式。
14. Merge、ViewStub的作用。
15. Json有什么优劣势。
16. 动画有哪两类，各有什么特点？
17. Handler、Loop消息队列模型，各部分的作用。
18. 怎样退出终止App。
19. Asset目录与res目录的区别。
20. Android怎么加速启动Activity。
21. Android内存优化方法：ListView优化，及时关闭资源，图片缓存等等。
22. Android中弱引用与软引用的应用场景。
23. Bitmap的四中属性，与每种属性队形的大小。
24. View与View Group分类。自定义View过程：onMeasure()、onLayout()、onDraw()。
25. Touch事件分发机制。
26. Android长连接，怎么处理心跳机制。
27. Zygote的启动过程。
28. Android IPC:Binder原理。
29. 你用过什么框架，是否看过源码，是否知道底层原理。
30. Android5.0、6.0新特性。

## 正确的单例怎么写

[如何正确地写出单例模式](http://wuchong.me/blog/2014/08/28/how-to-correctly-write-singleton-pattern/)