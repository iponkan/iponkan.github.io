---
title: targetSdkVersion的使用
date: 2017-4-26
categories: Android
tags:
   - Android
   - targetSdkVersion
---

Android targetSdkVersion的使用，以及Android如何保障兼容性。

<!--more-->

转自：[Android targetSdkVersion 原理](https://race604.com/android-targetsdkversion/)



前几天 Google 官方发布文章解析 compileSdkVersion、minSdkVersion 以及 targetSdkVersion 的含义，以及合理设置各个值的意义，原文 [Picking your compileSdkVersion, minSdkVersion, and targetSdkVersion](https://medium.com/google-developers/picking-your-compilesdkversion-minsdkversion-targetsdkversion-a098a0341ebd#.egywqatjg)（后面简称 “原文”），还有[翻译版](http://chinagdg.org/2016/01/picking-your-compilesdkversion-minsdkversion-targetsdkversion/)。

其中，compileSdkVersion 和 minSdkVersion 都非常好理解，前者表示编译的 SDK 版本，后者表示应用兼容的最低 SDK 版本。但是对于 targetSdkVersion 其实很难一句话解析清楚，原文用了“万能”的词 —— **interesting** 来描述。以前我也有一些迷糊，看到有些人和我有同样的困惑，本文试图彻底解决这个问题。

原文是这么说的：

> targetSdkVersion is the main way Android provides forward compatibility

targetSdkVersion 是 Android 系统提供前向兼容的主要手段。这是什么意思呢？随着 Android 系统的升级，某个系统的 API 或者模块的行为可能会发生改变，但是为了保证老 APK 的行为还是和以前兼容。只要 APK 的 targetSdkVersion 不变，即使这个 APK 安装在新 Android 系统上，其行为还是保持老的系统上的行为，这样就保证了系统对老应用的前向兼容性。

这里还是用原文的例子，在 Android 4.4 (API 19）以后，AlarmManager 的 [`set()`](http://developer.android.com/reference/android/app/AlarmManager.html?utm_campaign=adp_series_sdkversion_010616&utm_source=medium&utm_medium=blog#set%28int,%20long,%20android.app.PendingIntent%29) 和 [`setRepeat()`](http://developer.android.com/reference/android/app/AlarmManager.html?utm_campaign=adp_series_sdkversion_010616&utm_source=medium&utm_medium=blog#setRepeating%28int,%20long,%20long,%20android.app.PendingIntent%29) 这两个 API 的行为发生了变化。在 Android 4.4 以前，这两个 API 设置的都是精确的时间，系统能保证在 API 设置的时间点上唤醒 Alarm。因为省电原因 Android 4.4 系统实现了 AlarmManager 的对齐唤醒，这两个 API 设置唤醒的时间，系统都对待成不精确的时间，系统只能保证在你设置的时间点之后某个时间唤醒。

这时，虽然 API 没有任何变化，但是实际上 API 的行为却发生了变化，如果老的 APK 中使用了此 API，并且在应用中的行为非常依赖 AlarmManager 在精确的时间唤醒，例如闹钟应用。如果 Android 系统不能保证兼容，老的 APK 安装在新的系统上，就会出现问题。

Android 系统是怎么保证这种兼容性的呢？这时候 targetSdkVersion 就起作用了。APK 在调用系统 AlarmManager 的 `set()` 或者 `setRepeat()` 的时候，系统首先会查一下调用的 APK 的 targetSdkVersion 信息，如果小于 19，就还是按照老的行为，即精确设置唤醒时间，否者执行新的行为。

我们来看一下 Android 4.4 上 AlarmManger 的一部分源代码：

```java
private final boolean mAlwaysExact;  
AlarmManager(IAlarmManager service, Context ctx) {  
    mService = service;

    final int sdkVersion = ctx.getApplicationInfo().targetSdkVersion;
    mAlwaysExact = (sdkVersion < Build.VERSION_CODES.KITKAT);
}
```

看到这里，首选获取应用的 targetSdkVersion，判断是否是小于 Build.VERSION_CODES.KITKAT (即 API Level 19)，来设置 `mAlwaysExact` 变量，表示是否使用精确时间模式。

```java
public static final long WINDOW_EXACT = 0;  
public static final long WINDOW_HEURISTIC = -1;

private long legacyExactLength() {  
    return (mAlwaysExact ? WINDOW_EXACT : WINDOW_HEURISTIC);
}

public void set(int type, long triggerAtMillis, PendingIntent operation) {  
    setImpl(type, triggerAtMillis, legacyExactLength(), 0, operation, null);
}
```

这里看到，直接影响到 set() 方法给 `setImpl()` 传入不同的参数，从而影响到了 set() 的执行行为。具体的实现在 `AlarmManagerService.java`，这里就不往下深究了。

看到这里，发现其实 Android 的 targetSdkVersion 并没有什么特别的，系统使用它也非常直接，甚至很“粗糙”。仅仅是用过下面的 API 来获取 targetSdkVersion，来判断是否执行哪种行为：

```
getApplicationInfo().targetSdkVersion;  
```

所以，我们可以猜测到，如果 Android 系统升级，发生这种兼容行为的变化时，一般都会在原来的保存新旧两种逻辑，并通过 `if-else` 方法来判断执行哪种逻辑。果然，在源码中搜索，我们会发现不少类似 `getApplicationInfo().targetSdkVersion < Buid.XXXX` 这样的代码，相对于浩瀚的 Android 源码量来说，这些还是相对较少了。其实原则上，这种会导致兼容性问题的修改还是越少越好，所以每次发布新的 Android 版本的时候，Android 开发者网站都会列出做了哪些改变，在[这里](http://developer.android.com/about)，开发者需要特别注意。

最后，我们也可以理解原文中说的那句话的含义，明白了为什么修改了 APK 的 targetSdkVersion 行为会发生变化，也明白了为什么修改 targetSdkVersion 需要做完整的测试了。

写完这篇文章，再回头去看一下原文的 *targetSdkVersion* 那一段，发现作者是说的多么“滴水不漏”。