---
title: Android Studio 奇技淫巧
date: 2018-2-11
categories: Android
tags: 
   - Android Studio
   - Android
---

总结Android Studio奇技淫巧。

<!-- more -->

## 配置多端同步配置

对于jetbrain家族，可以把自定义配置同步到github，实现多端(Windows，Mac， Linux)同步。

其实这里有两种方法：

1. 注册jetbrain帐号，然后绑定到github上
2. 直接将配置到github仓库上

我采用的是第二种方式，其实都是放在github上，我倒觉得第一种方式更为麻烦。

具体方法，参考 [ **Android Studio 多设备同步配置**  ]( https://blog.csdn.net/aa464971/article/details/89364015 )

奇怪的是我用ssh的方式不能配置，用https配置成功的，暂时不知道为什么，看官们可以看看我上传到github的效果 [Android Studio](https://github.com/iponkan/as-setting)，[WebStrom]( https://github.com/iponkan/webstrom-setting )

## 工具使用

-  Layout  Inspector 
-  Extract - Style 抽出控件Style
-  Extract - Method 抽出方法
-  Annotate 标注每一行是git哪个用户那个版本什么时候提交的
-   集成bug追踪系统 
-   修改方法签名 比refactor更高级

## 调试技巧

[Android Studio你不知道的调试技巧](http://weishu.me/2015/12/21/android-studio-debug-tips-you-may-not-know/index.html)

主要是

- attach to debugger的使用

  android studio上没有默认的快捷键，可以自己添加一个，我用alt+a

- 表达式的使用

## 插件

- [Android ButterKnife Zelezny](https://plugins.jetbrains.com/plugin/7369-android-butterknife-zelezny/)
  

注意暂时还不支持kotlin

- [Android FindViewById Support](https://plugins.jetbrains.com/plugin/11204-android-findviewbyid-support/)
  这个插件是配合Android ButterKnife Zelezny使用的，支持kotlin场景，我本人的习惯是自定义view的时候使用这个插件，而不用引入butternife依赖
- [leetcode插件](https://plugins.jetbrains.com/plugin/12132-leetcode-editor/)
- [Translatioin](https://plugins.jetbrains.com/plugin/8579-translation/)
- [Android Parcelable code generator](https://plugins.jetbrains.com/plugin/7332-android-parcelable-code-generator/)
- [GsonFormat]( https://plugins.jetbrains.com/plugin/7654-gsonformat/ )

## 配色

Android Logcat 配色方案(**都是设置foreground**)

- Assert   #FF4949
- Debug  #6897BB
- Error    #FF6B68
- Info      #6A8759
- Verbose   #BBBBBB
- Warning    #BBB529

## 快捷键

| 功能             | 快捷键                 |
| :------------- | :------------------ |
| 查看代码所在位置的上下文信息 | Alt+Q               |
| 在方法和内部类之间跳转    | Alt + 上/下           |
| 定位到父类          | Ctrl+U              |
| 显示/隐藏数字编号面板    | Alt + 数字编号          |
| 显示方法参数         | Ctrl+P              |
| 查看方法定义         | Ctrl+Shift+I        |
| 查看最近修改的文件      | Ctrl+Shift+E        |
| 查看最近使用的文件      | Ctrl+E              |
| 扩大/缩小选择        | Ctrl+W Ctrl+Shift+W |
| 查看类所有方法        | Ctrl+F12            |
| 版本控制操作弹窗       | Alt+`               |

## 快捷输入

| 功能     | 快捷输入                      |
| ------ | ------------------------- |
| 非空判断   | 对象.nn                     |
| 为空判断   | 对象.null                   |
| for循环  | 对象.for， 对象.fori ， 对象.forr |
| if判断   | 判断条件.if                   |
| 实例类型判断 | 对象.inst , 对象.instanceof   |

## 相关链接

[Live Templates](http://stormzhang.com/2016/08/21/android-studio-live-templates/)

