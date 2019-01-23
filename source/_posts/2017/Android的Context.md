---
title: Android的Context
date: 2017-7-6
categories: Android
tags: Android
---
分析Android的Context。
<!-- more -->
## Context结构

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

*ContextImpl 直接用类查找的方式在Studio查找不出来，使用具体搜索的时候可以搜索出来。因为ContextImpl的源代码定义了两个类*

## 获取 Context

1）View.getContext,返回当前 Activity 所在的应用进程的 Context 对象，通常是当前正在展示的 Activity 对象

2）getApplication 和 getApplicationContext 获取的对象时一致的。但是getApplication 方法只有在 Activity 和 Service 中才能调到。但例如BroadcasrReceiver 中需要获取 Application，则需要借助 getApplicationContext（） 方法。
