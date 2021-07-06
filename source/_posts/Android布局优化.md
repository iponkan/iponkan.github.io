---
title: Android布局优化
date: 2017-3-8
categories: Android
tags:
   - Android
   - 布局
   - 优化
---

这里主要介绍两种布局优化的方向：

1. 重用布局及技巧
2. 实用懒加载

<!-- more -->

## include的使用

通过此标签来包含一个布局，这适用于一个布局并不包含太多的逻辑和动画，如果这个布局包含了一些逻辑和动画，建议使用一个自定义的ViewGroup来封装，这样能有效的减少代码。

## mergre

megre是对include的优化，想象这种使用场景： 通常我们去包含一个布局的时候往往要指定这个布局的位置，这样，在你include的那个layout里面有一个根布具，你include又在一个布局里面，这样就没有必要的增加了一个布局，这时侯就可以用megre来解决。

小技巧：

使用megre的时候你会发现，英文在megre下你的布局可能缺少父布局，这时候你就没有办法看到预览，这时候你可以使用tools工具来预览，在megre标签加入如下代码：

```
tools:showIn="@layout/camera_beauty_activity"
```
camera_beauty_activity为include这个megre布局的布局

同时也可以添加`tools:ignore="all"`来忽略所有因为缺少父布局而产生的warning

关于tools的使用：

[android中xml tools属性详解](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0309/2567.html)

## ViewStub

ViewStub默认不显示，可以在一定条件下调用显示，若需要使用ViewStub显示的空间需要添加至少一个id(在要inflate的layout定义或者在ViewStub里面定义，原理同include)，详见下方应用链接 

[Android布局优化之ViewStub、include、merge使用与源码分析](http://blog.csdn.net/bboyfeiyu/article/details/45869393)

## 避免深层次的视图结构
有时候为了摆放一个视图，你可能尝试添加另一个LinearLayout。你可能使用这种方法解决：

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    >

    <RelativeLayout
        ...
        >

        <LinearLayout
            ...
            >

            <LinearLayout
                ...
                >

                <LinearLayout
                    ...
                    >
                </LinearLayout>

            </LinearLayout>

        </LinearLayout>

    </RelativeLayout>

</LinearLayout>
```

即使你没有非常明确的在一个layout布局文件中这样使用，如果你在Java文件中从一个view inflate（这个inflate翻译不过去，大家理解就行） 到其他views当中，也是可能会发生的。

可能会导致一系列的问题。你可能会遇到性能问题，因为处理起需要处理一个复杂的UI树结构。 还可能会导致以下更严重的问题[StackOverflowError](http://stackoverflow.com/questions/2762924/java-lang-stackoverflow-error-suspected-too-many-views).

因此尽量保持你的视图tree：学习如何使用[RelativeLayout](https://developer.android.com/guide/topics/ui/layout/relative.html), 如何 [optimize 你的布局](http://developer.android.com/training/improving-layouts/optimizing-layout.html) 和如何使用 [`<merge>` 标签](http://stackoverflow.com/questions/8834898/what-is-the-purpose-of-androids-merge-tag-in-xml-layouts).