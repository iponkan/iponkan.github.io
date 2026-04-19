---
title: 为何大厂APP如微信、支付宝、淘宝、手Q等只适配了armeabi-v7aarmeabi？
date: 2021-07-10
categories:
  - Android
tags:
  - Android
---

转自[为何大厂APP如微信、支付宝、淘宝、手Q等只适配了armeabi-v7a/armeabi？](https://segmentfault.com/a/1190000023517574)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e45f6cdb851d2~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

### 0\. 前言

前几天啊，在公众号发了一篇文章《优化 ApK 大小之 ABI Filters 和 APK split》，评论区收到了一些留言说，文章讲得不够深入，关于系统是如何选择不同 abi 下的 so 库的？当前 APP 该如何适配？该去掉哪些该保留哪些？都存在一些疑问。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/5/171e45cbff89e272~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

因此，决定亲自更文一篇，系统地讲一下关于 Android CPU 架构方面的一些东西，以及结合大厂 APP 如微信、支付宝、淘宝等 APP 的适配情况，分析我们开发 APP 中该如何适配。本文涉及以下几个问题：

*   什么是 ABI？
*   ABI 有何作用？
*   目前大厂 APP 是如何适配不同的 CPU 架构的？
*   ABI 是如何工作的？
*   我们自己的 APP 中该如何适配？
*   ABI split - 性能 + 兼容全都要

本篇文章中，就一一为你解答这些疑问。

### 1\. 什么是 ABI?

ABI 是英文 Application Binary Interface 的缩写，及应用二进制接口。

不同 Android 设备，使用的 CPU 架构可能不同，因此支持不同的指令集。 CPU 与指令集的每种组合都有其自己的应用二进制界面（或 ABI）,ABI 非常精确地定义了应用程序的机器代码应如何在运行时与系统交互。您必须为要与您的应用程序一起使用的每种 CPU 架构指定一个 ABI（Application Binary Interface）。

ABI 包含以下信息：

*   可使用的 CPU 指令集（和扩展指令集）。
*   运行时内存存储和加载的字节顺序。Android 始终是 little-endian。
*   在应用和系统之间传递数据的规范（包括对齐限制），以及系统调用函数时如何使用堆栈和寄存器。
*   可执行二进制文件（例如程序和共享库）的格式，以及它们支持的内容类型。Android 始终使用 ELF。
*   如何重整 C++ 名称。

Android 目前支持以下 7 种 ABIs:

```
mips, mips64, X86, X86–64, arm64-v8a, armeabi, armeabi-v7a

```

### 2\. ABI 有何作用？

当我们想要在项目中使用 native（C/C++） 类库, 我们必须对要支持的处理器架构提供对应编译包。每个处理器架构需要我们提供一个或多个包含 native 代码的. so 文件。

默认情况下，为了使 APP 有更好的兼容性，我们使用 Android Studio 或者命令打包时，会默认支持所有的架构，但相应的 APK size 会疯狂的增大。对于用户来说，目标设备只需要其中一个版本，但当用户下载 APK 时，会全部下载（对用户来说相当的不友好）。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171d9871f97775a2~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

怎么办呢？`abifilters` 为我们提供了解决方案,`abifilters`为我们提供了选择适配指定 CPU 架构的能力，只需要在 app 下的`build.gradle`添加如下配置：

```
android {
        defaultConfig {
            ndk {
                abiFilters 'arm64-v8a', 'x86_64'
            }
        }

}

```

你可能看了上面的这些文字，还不能理解 abi 的作用，那么我们就用一个简单的例子来说明一下。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171d98ccd16d2c6a~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

##### 2.1 举例说明 ABI 的作用

首先，我们创建一个最简单的`Hello world`应用，只有一个 Activity 和一个启动图标。我们看以下打出来的 apk:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171d9a4f9852040e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

没有任何的原生库使用，大小为`2.1MB`，现在我们为它添加多 ABI 原生库支持，我们在项目中集成`Realm`，然后打包。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171d9c39394a87b9~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

看到没，apk 大小从`2.1MB`猛增加到`11.2MB`, 多了一个原生 so 库的文件夹，大小为`8.8MB`，我们来看一下它的详细信息：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171d9c65b63dd997~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

如上图所示，`Realm`为 5 种 CPU 架构生成了`.so`库，分别是`mips`、`x86`、`x86_64`、`arm64-v8a`、`armeabi-v7a`。增加了`8.8MB`包的大小。但是这不是我们想要的，我们只想要适配我们指定的的 CPU 架构，因此，我们需要在 gralde.build 中添加`abifilters`配置来完成我们想要的效果：

```
android {
    compileSdkVersion 28 // 编译sdk版本
    defaultConfig {
        applicationId "com.example.zhouwei.helloworld"
        minSdkVersion 15
        targetSdkVersion 28
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
        // 适配指定CPU架构
        ndk {
            abiFilters 'arm64-v8a', 'x86_64'
        }
    }
}

```

效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171dac017c1f253d~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

可以看到，只生成了我们指定 CPU 架构的 so 文件，包的大小也减少了`5.3MB`。

这时候，你可能会有一个疑问，Android 共支持 7 种 CPU 架构，那么，我们在实际项目中该适配哪些 CPU 架构能保证最好的兼容，同时又最大限度的减少 APK 的大小？

在回答这个问题之前，我们不妨看一下这些顶级巨头公司，他们是是如何适配的。

### 3\. 目前大厂 APP 是如何适配不同的 CPU 架构的？

首先，我们下载一些大厂的 APK，看一下他们的适配情况，这里我分析了微信、手机 QQ、支付宝和淘宝这 4 个 APP 的适配情况：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171dacd5d3bdced0~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

可以看到，微信适配的是`arm64-v8a`(微信应该是最近才适配到`arm64-v8a`, 以前是`armeabi`), 支付宝和手 Q 适配的是`armeabi`，淘宝适配的是`armeabi-v7a`。各个 APP 适配的平台不太一样，但是他们有一个共同点，那就是它们只指定了一个平台。

等等，上面这些 APP 只适配了一中 CPU 架构，比如只适配了`armeabi-v7a`, 那如果 APP 装在其他架构的手机上，如`arm64-v8a`上，会蹦吗？

要弄清楚这个问题，我们得先搞清楚，ABI 是如何工作的。

### ABI 是如何工作的呢？

官方文档解释如下：

Android 系统在运行时知道它支持哪些 ABI，因为版本特定的系统属性会指示：

*   设备的主要 ABI，与系统映像本身使用的机器代码对应。
*   （可选）与系统映像也支持的其他 ABI 对应的辅助 ABI。

此机制确保系统在安装时从软件包提取最佳机器代码。

为实现最佳性能，应直接针对主要 ABI 进行编译。例如，基于 ARMv5TE 的典型设备只会定义主 ABI：armeabi。相反，基于 ARMv7 的典型设备将主 ABI 定义为 armeabi-v7a，并将辅助 ABI 定义为 armeabi，因为它可以运行为每个 ABI 生成的应用原生二进制文件。

64 位设备也支持其 32 位变体。以 arm64-v8a 设备为例，该设备也可以运行 armeabi 和 armeabi-v7a 代码。但请注意，如果应用以 arm64-v8a 为目标，而非依赖于运行 armeabi-v7a 版应用的设备，则应用在 64 位设备上的性能要好得多。

许多基于 x86 的设备也可运行 armeabi-v7a 和 armeabi NDK 二进制文件。对于这些设备，主 ABI 将是 x86，辅助 ABI 是 armeabi-v7a。

上面这一段是不是有点看蒙了，这里我来简单解释以下。**总的来说，就是一个 Android 设备可以支持多种 ABI, 设备主 ABI 和辅助 ABI, 以`arm64-v8a`为主 ABI 的设备，辅助 ABI 为`armeabi-v7a`和`armeabi`，以`armeabi-v7a`为主 ABI 的设备，辅助 ABI 为`armeabi`。**

另外，**x86 架构的手机都会包含由 Intel 提供的称为 Houdini 的指令集动态转码工具，实现对 arm .so 的兼容，也就是说有适配 armeabi 平台的 APP 是可以跑在 x86 手机上的。**

##### 3.1 主辅助 ABI 具体适配流程

前面说了 ABI 的工作原理，一个 Android 设备支持主辅 ABI, 那么他们具体是如何工作的呢？我们以`arm64-v8a`架构的手机为例：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171dafefbaac1c42~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

对于一个 cpu 是 arm64-v8a 架构的手机，它运行 app 时，进入 jnilibs 去读取库文件时，先看有没有 arm64-v8a 文件夹，如果没有该文件夹，去找 armeabi-v7a 文件夹，如果没有，再去找 armeabi 文件夹，如果连这个文件夹也没有，就抛出异常；

如果有 arm64-v8a 文件夹，那么就去找特定名称的. so 文件，注意：如果没有找到想要的`.so`文件，不会再往下（armeabi-v7a 文件夹）找了，而是直接抛出异常。

```
Exception:Java.lang.UnsatisfiedLinkError: dlopen failed: library “/***.so” not found 

```

特别需要注意的情况是在命中了文件夹，而未命中 so 文件这种情况：

*   比如命中了`arm64-v8a`文件夹，没有找到需要的 so 文件，就不会再往下（armeabi-v7a 文件夹）找了，而是直接抛出异常。
*   如果你的项目用到了第三方依赖，如果只保留一个 ABI 的时候，建议在 Build 中加入 ndk.abiFilters
*   例如：第三方 aar 文件，如果这个 sdk 对 abi 的支持比较全，可能会包含 armeabi、armeabi-v7a、x86、arm64-v8a、x86\_64 五种 abi，而你应用的其它 so 只支持 armeabi、armeabi-v7a、x86 三种，直接引用 sdk 的 aar，会自动编译出支持 5 种 abi 的包。但是应用的其它 so 缺少对其它两种 abi 的支持，那么如果应用运行于 arm64-v8a、x86\_64 为首选 abi 的设备上时，就会 ==crash== 了哦。

因此，我们需要在我们的 app 中配置 abiFilter 配置，来避免一些未知的错误。

```
defaultConfig {  
    ndk {  
        abiFilters "armeabi"// 指定ndk需要兼容的ABI(这样其他依赖包里x86,armeabi,arm-v8之类的so会被过滤掉) 
    }  
}

```

##### 3.2 Android 7 种 CPU 架构在当前市场的占有率

*   `arm64-v8a`: 目前主流版本
*   `armeabi-v7a`: 一些老旧的手机
*   `x86 / x86_64`: x86 架构的手机都会包含由 Intel 提供的称为 Houdini 的指令集动态转码工具，实现对 arm .so 的兼容，再考虑 x86 1% 以下的市场占有率，x86 相关的两个 .so 也是可以忽略的
*   `armeabi/mips / mips64`: NDK 以前支持 ARMv5 (armeabi) 以及 32 位和 64 位 MIPS，但 NDK r17 已不再支持，极少用于手机可以忽。

目前手机市场上，`x86 / x86_64/armeabi/mips / mips6` 的架构，基本可以不不考虑了，它们的占有量应很少很少了，`arm64-v8a`**作为最新一代架构，应该是目前的主流**，`armeabi-v7a`只存在少部分老旧手机。

我试着在 Google 上查找，具体的市场占有数据，但没找到，但是从国民级应用微信只适配`arm64-v8a`就可以看出，`arm64-v8a`是目前的主流，并且还有一点，Google Play 从 2019 年 8 月开始，就强制 APP 适配`arm64-v8a`，以慢慢淘汰 32 位的`armeabi-v7a`。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/4/171dd683207fb41f~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

### 4\. 我们项目中该如何适配呢？

这里就可以回答前面的两个问题了。

`Q1`： 只适配了`armeabi-v7a`, 那如果 APP 装在其他架构的手机上，如`arm64-v8a`上，会蹦吗？

`A:` 不会，但是反过来会。

因为`armeabi-v7a`和`arm64-v8a`会向下兼容：

*   只适配`armeabi`的 APP 可以跑在`armeabi`,`x86`,`x86_64`,`armeabi-v7a`,`arm64-v8`上
*   只适配`armeabi-v7a`可以运行在`armeabi-v7a`和`arm64-v8a`
*   只适配`arm64-v8a` 可以运行在`arm64-v8a`上

那我们该如何适配呢？给出如下几个方案：

`方案一`：只适配`armeabi`

*   `优点:`基本上适配了全部 CPU 架构（除了淘汰的 mips 和 mips\_64）
*   `缺点：`性能低，相当于在绝大多数手机上都是需要辅助 ABI 或动态转码来兼容

`方案二`：只适配 `armeabi-v7a`

同理方案一，只是又筛掉了一部分老旧设备, 在性能和兼容二者中比较平衡

`方案三:` 只适配 `arm64-v8`

*   `优点:` 性能最佳
*   `缺点：` 只能运行在`arm64-v8`上，要放弃部分老旧设备用户

这三种方案都是可以的，现在的大厂 APP 适配中，这三种都有，大部分是前 2 种方案。具体选哪一种就看自己的考量了，以性能换兼容就`arm64-v8`, 以兼容换性能`armeabi`, 二者稍微平衡一点的就`armeabi-v7a`。

目前来说，大多数的大厂 APP 用的都是`armeabi`或`armeabi-v7a`，只有像微信这种牛逼的 APP, 为了追求性能和用户体验，放弃了少部分设备，这也说得通吧，毕竟微信也不在乎苍蝇那点肉。

### 5\. 番外篇 - 性能 + 兼容能否兼得？

其实到上一小节，本文就该结束了，但总感觉优点意犹未尽，除了适配所有全部 CPU 架构外，就特么不能性能和兼容同时兼得吗？其实 Google 早有考虑。也是可以实现的那就是 abi split，分包，实现也很简单，在 gradle 中添加如下配置：

```
 android {
      ...
      splits {

    // Configures multiple APKs based on ABI.

    abi {

      // Enables building multiple APKs per ABI.
      enable true

      // By default all ABIs are included, so use reset() and include to specify that we only
      // want APKs for x86 and x86_64.

      // Resets the list of ABIs that Gradle should create APKs for to none.
      reset()

      // Specifies a list of ABIs that Gradle should create APKs for.
      include "x86", "x86_64", "arm64-v8a", "armeabi", "armeabi-v7a"

      // Specifies that we do not want to also generate a universal APK that includes all ABIs.
      universalApk false
    }
  }
}


    // Configures multiple APKs based on ABI.
```

然后，就能为每个 CPU 架构单独打一个 APK，该 apk 中就只包含一个平台，如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/4/171dd961869d0cb7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/4/171dd96b954c88f0~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

这样，又能保证性能，又能不额外增加 APK 的大小，同时又又很完美的兼容，因为可以为所有架构都单独打一个包，一举多得。

同时，Google Play 支持上传多个 APK:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/4/171dd9a1a9d722cc~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

这样，就能根据不同的 CPU 架构，下载不同的包啦！

但是，但是，但是，很遗憾，国内的应用商店目前还不支持！

**参考文章**

*   [https://www.diycode.cc/topics/691](https://www.diycode.cc/topics/691)
*   [https://developer.android.com/ndk/guides/abis](https://developer.android.com/ndk/guides/abis)
*   [https://android.jlelse.eu/controlling-apk-size-when-using-native-libraries-45c6c0e5b70a](https://android.jlelse.eu/controlling-apk-size-when-using-native-libraries-45c6c0e5b70a)

以上就是本文的全部内容，如有错误，欢迎评论区指出。原创不易，如果你喜欢本文，欢迎点赞、转发、收藏三连一下。

另外欢迎关注我的公众号`「技术最TOP」`, 每天都有优质技术文章推送。

每天都有干货文章持续更新，可以微信搜索`「 技术最TOP 」`第一时间阅读，回复【思维导图】【面试】【简历】有我准备一些 Android 进阶路线、面试指导和简历模板送给你

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/9/171f73bb1a39299e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)