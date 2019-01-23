---
title: ANR和Monkey问题的记录
date: 2017-3-25
categories: Android
tags:
   - Android
   - ANR
   - Monkey
---

主要对ANR和Monkey产生的问题做一下解决问题的记录。

<!--more-->

引起ANR问题的根本原因，总的来说可以归纳为两类：

- 应用进程自身引起的，例如：

主线程阻塞、挂起、死循环

应用进程的其他线程的CPU占用率高，使得主线程无法抢占到CPU时间片

- 其他进程间接引起的，例如：

当前应用进程进行进程间通信请求其他进程，其他进程的操作长时间没有反馈

其他进程的CPU占用率高，使得当前应用进程无法抢占到CPU时间片

##  traces文件

只需要看开头，每次发生ANR， 这个文件都会被清空，写入新的内容. 如果想查看以前发生ANR的信息， 可以去查看DropBox文件，默认保存3天的ANR信息.

 native thread有10种状态, 对应着java thread的6种状态.

```java
static final Thread.State[] STATE_MAP = new Thread.State[] {
            Thread.State.TERMINATED,     // ZOMBIE
            Thread.State.RUNNABLE,       // RUNNING
            Thread.State.TIMED_WAITING,  // TIMED_WAIT
            Thread.State.BLOCKED,        // MONITOR
            Thread.State.WAITING,        // WAIT
            Thread.State.NEW,            // INITIALIZING
            Thread.State.NEW,            // STARTING
            Thread.State.RUNNABLE,       // NATIVE
            Thread.State.WAITING,        // VMWAIT
            Thread.State.RUNNABLE        // SUSPENDED
    };
```

附：cpu 负载

CPU负载/平均负载

CPU负载是指某一时刻系统中运行队列长度之和加上当前正在CPU上运行的进程数，而CPU平均负载可以理解为一段时间内正在使用和等待使用CPU的活动进程的平均数量。在Linux中“活动进程”是指当前状态为运行或不可中断阻塞的进程。通常所说的负载其实就是指平均负载。
用一个从网上看到的很生动的例子来说明（不考虑CPU时间片的限制），把设备中的一个单核CPU比作一个电话亭，把进程比作正在使用和等待使用电话的人，假如有一个人正在打电话，有三个人在排队等待，此刻电话亭的负载就是4。使用中会不断的有人打完电话离开，也会不断的有其他人排队等待，为了得到一个有参考价值的负载值，可以规定每隔5秒记录一下电话亭的负载，并将某一时刻之前的一分钟、五分钟、十五分钟的的负载情况分别求平均值，最终就得到了三个时段的平均负载。
实际上我们通常关心的就是在某一时刻的前一分钟、五分钟、十五分钟的CPU平均负载，例如以上日志中这三个值分别是3.85、3.41、3.16，说明前一分钟内正在使用和等待使用CPU的活动进程平均有3.85个，依此类推。在大型服务器端应用中主要关注的是第五分钟和第十五分钟的两个值，但是Android主要应用在便携手持设备中，有特殊的软硬件环境和应用场景，短时间内的系统的较高负载就有可能造成ANR，所以笔者认为一分钟内的平均负载相对来说更具有参考价值。
CPU的负载和使用率没有必然关系，有可能只有一个进程在使用CPU，但执行的是复杂的操作；也有可能等待和正在使用CPU的进程很多，但每个进程执行的都是简单操作。
实际处理问题时偶尔会遇到由于平均负载高引起的ANR，典型的特征就是系统中应用进程数量多，CPU总使用率较高，但是每个进程的CPU使用率不高，当前应用进程主线程没有异常阻塞，一分钟内的CPU平均负载较高。



参考链接： [Android ANR 分析](http://haiolv.github.io/2016/06/13/android-anr%E5%88%86%E6%9E%90/)