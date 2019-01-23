---
title: Android持久化数据的解决方案
date: 2017-4-26
categories: Android
tags:
   - Android
---

关于Android持久化数据的解决方法和设计模式

<!-- more -->
## 三种方式

Android系统中主要提供了三种方式用于简单地实现数据持久化功能，即文件存储、SharedPreference存储以及数据库存储。

- 文件存储

- SharedPreference存储

- 数据库存储

## 设计模式

三种存储方式各有利弊，针对不同的业务需求可以采用不同的方案。总结一下，这三种方式其实都实现了增删改查的接口，这样我们就可以抽象出一个接口出来而不用关心具体存储方式的实现。

上代码：

```java
/**
 * 持久化数据存储接口
 * 提供持久化数据的增删改查
 */
public interface ILocalDataManager<T> {

    // 增
    void insert(T t);

    // 删
    void delete(int number);

    // 改
    void update(T t);

    // 查
    T get(int number);

}
```



对于具体存储方式的实现就是实现这个接口

```java
/**
 * 序列化保存文件方式
 */
public class SerialDataManager<T> implements ILocalDataManager<T> {

    @Override
    public void insert(T t) {

    }

    @Override
    public void delete(int number) {

    }

    @Override
    public void update(T t) {

    }

    @Override
    public T get(int number) {
        return null;
    }
}
```

然后使用的时候就是这样的

```java
// 父类对象指向子类引用
ILocalDataManager mDataManager = new SerialDataManager();
Object object = new Object();
int id = object.getId();
mDataManager.insert(object);
mDataManager.delete(id);
mDataManager.update(object);
Object findObject = mDataManager.get(id);
```

