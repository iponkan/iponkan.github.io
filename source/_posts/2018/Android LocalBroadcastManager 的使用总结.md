---
title: Android LocalBroadcastManager 的使用总结
date: 2018-2-26
categories: Android
tags:
   - Android
   - LocalBroadcastManager
---

转自：[Android LocalBroadcastManager 的使用总结](https://www.cnblogs.com/zhaoyanjun/p/6048369.html)

## 前言

在Android中，Broadcast是一种广泛运用的在应用程序之间传输信息的机制。我们拿广播电台来做个比方。我们平常使用收音机收音是这样的：许许多多不同的广播电台通过特定的频率来发送他们的内容，而我们用户只需要将频率调成和广播电台的一样就可以收听他们的内容了。Android中的广播机制就和这个差不多的道理。

<!-- more -->

## BroadcastReceiver安全问题

BroadcastReceiver设计的初衷是从全局考虑可以方便应用程序和系统、应用程序之间、应用程序内的通信，所以对单个应用程序而言BroadcastReceiver是存在安全性问题的(恶意程序脚本不断的去发送你所接收的广播)。为了解决这个问题LocalBroadcastManager就应运而生了。

## LocalBroadcastManager

LocalBroadcastManager是Android Support包提供了一个工具，用于在同一个应用内的不同组件间发送Broadcast。LocalBroadcastManager也称为局部通知管理器，这种通知的好处是安全性高，效率也高，适合局部通信，可以用来代替Handler更新UI

- 好处：

  > 1、因广播数据在本应用范围内传播，你不用担心隐私数据泄露的问题。
  > 2、不用担心别的应用伪造广播，造成安全隐患。
  > 3、相比在系统内发送全局广播，它更高效。

## LocalBroadcastManager用法

- LocalBroadcastManager对象的创建

  > LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance( this ) ;

- 注册广播接收器

  > LocalBroadcastManager.registerReceiver( broadcastReceiver , intentFilter );

- 发送广播

  > LocalBroadcastManager.sendBroadcast( intent ) ;

- 取消注册广播接收器

  > LocalBroadcastManager.unregisterReceiver( broadcastReceiver );

## LocalBroadcastManager部分源码解析

```
    private static LocalBroadcastManager mInstance;

    public static LocalBroadcastManager getInstance(Context context) {
        synchronized (mLock) {
            if (mInstance == null) {
                mInstance = new LocalBroadcastManager(context.getApplicationContext());
            }
            return mInstance;
        }
    }

    private LocalBroadcastManager(Context context) {
        mAppContext = context;
        mHandler = new Handler(context.getMainLooper()) {

            @Override
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case MSG_EXEC_PENDING_BROADCASTS:
                        executePendingBroadcasts();
                        break;
                    default:
                        super.handleMessage(msg);
                }
            }
        };
    } 
```

从这个部分源码可以看出两点：

- 在获取LocalBroadcastManager对象实例的时候，这里用了单例模式。并且把外部传进来的Context 转化成了ApplicationContext，有效的避免了当前Context的内存泄漏的问题。这一点我们在设计单例模式框架的时候是值得学习的，看源码可以学习到很多东西。
- 在LocalBroadcastManager构造函数中创建了一个Handler.可见 LocalBroadcastManager 的本质上是通过Handler机制发送和接收消息的。
- 在创建Handler的时候，用了 `context.getMainLooper()` , 说明这个Handler是在Android 主线程中创建的，广播接收器的接收消息的时候会在Android 主线程，所以我们决不能在广播接收器里面做耗时操作，以免阻塞UI。

## 一个小例子

```
package com.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

public class MainActivity extends AppCompatActivity {

    private LocalBroadcastManager localBroadcastManager ;
    private MyBroadcastReceiver broadcastReceiver ;
    private IntentFilter intentFilter ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //注册广播接收器
        localBroadcastManager = LocalBroadcastManager.getInstance( this ) ;
        broadcastReceiver = new MyBroadcastReceiver() ;
        intentFilter = new IntentFilter( "myaction") ;
        localBroadcastManager.registerReceiver( broadcastReceiver , intentFilter );

        //在主线程发送广播
        Intent intent = new Intent( "myaction" ) ;
        intent.putExtra( "data" , "主线程发过来的消息" ) ;
        localBroadcastManager.sendBroadcast( intent ) ;

        new Thread(new Runnable() {
            @Override
            public void run() {
                //在子线程发送广播
                Intent intent = new Intent( "myaction" ) ;
                intent.putExtra( "data" , "子线程发过来的消息" ) ;
                localBroadcastManager.sendBroadcast( intent ) ;
            }
        }).start(); ;

    }

    private class MyBroadcastReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction() ;
            if ( "myaction".equals( action )){
                Log.d( "tttt 消息：" + intent.getStringExtra( "data" )  , "线程： " + Thread.currentThread().getName() ) ;
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        //取消注册广播,防止内存泄漏
        localBroadcastManager.unregisterReceiver( broadcastReceiver );
    }
}

```

运行结果

```
D/tttt 消息：主线程发过来的消息: 线程： main
D/tttt 消息：子线程发过来的消息: 线程： main
```

可以看出，广播接收器的`onReceive`方法运行在主线程。

## 注意事项

虽然LocalBroadcastManager也通过`BroadcastReceiver`来接收消息，但是他们两个之间还是有很多区别的。

> - LocalBroadcastManager注册广播只能通过代码注册的方式。传统的广播可以通过代码和xml两种方式注册。

> - LocalBroadcastManager注册广播后，一定要记得取消监听。这一步可以有效的解决内存泄漏的问题。

> - LocalBroadcastManager注册的广播，您在发送广播的时候务必使用`LocalBroadcastManager.sendBroadcast(intent);` 否则您接收不到广播。传统的发送广播的方法：`context.sendBroadcast( intent );`

