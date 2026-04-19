---
title: Android上传aar到jcenter的正确姿势
date: 2019-08-08
categories:
  - Android
tags:
  - Android
  - gradle
  - aar
---

Android上传aar到jcenter的正确姿势

## 常规操作

[Android Studio 上传aar(Library)到JCenter - 简书](https://www.jianshu.com/p/77894c3bc0d6)

完成上述操作后可以成功把aar上传到jcenter。但是有个问题——aar的依赖传递问题，下面会详细描述，这里以我的[commonlib项目](https://github.com/sonicers/commonlib)为例。

这个库用于快速构建android工程，如果想快速构建一个app而不在意依赖的aar细节时，可以使用本库进行快速开发。

## 问题描述

按照上述的方式打包aar后我们可以在工程里方便使用：

```groovy
implementation 'com.sonicers:commonlib:0.0.8'
```

但是sync后会发现，ide报出没找到OkHttp包等的问题，因为这个库依赖了OkHttp等包

```groovy
// 网络
api 'com.squareup.okhttp3:okhttp:3.10.0'
api 'com.squareup.okhttp3:logging-interceptor:3.10.0'
api 'com.squareup.retrofit2:retrofit:2.3.0'
api 'com.squareup.retrofit2:converter-gson:2.3.0'
api 'com.squareup.retrofit2:adapter-rxjava2:2.3.0'
```

gradle默认是不会把lib里面的依赖传递进来的，这就是**依赖传递**问题

我们需要添加一个属性：

```groovy
implementation('com.sonicers:commonlib:0.0.8') {
    transitive = true//依赖传递为true时才能把依赖的库打进去
}
```

加了以后，嗯，发现没什么卵用 (⊙ө⊙)，嗯，基本操作，程序员天天遇到。。。

原因在于使用上述上传aar到jcenter的常规操作，**没有把依赖信息打进pom.xml**。关于pom文件的用处，可以网上自己搜搜。可以参考

[Android-少不了的 AAR 文件常识，最好知道的注意事项](%5Bhttps://drprincess.github.io/2018/01/31/Android-%E5%B0%91%E4%B8%8D%E4%BA%86%E7%9A%84AAR%E6%96%87%E4%BB%B6/%5D\(https://drprincess.github.io/2018/01/31/Android-%E5%B0%91%E4%B8%8D%E4%BA%86%E7%9A%84AAR%E6%96%87%E4%BB%B6/\))

> Google Android Studio 的负责人在 stackoverflow 上解释了 [为什么 Android Studio 不能将多个依赖打包进一个 AAR 文件](https://stackoverflow.com/questions/20700581/android-studio-how-to-package-single-aar-from-multiple-library-projects/20715155#20715155)的原因，是因为将不同的library打包在一起，涉及到资源和配置文件智能合并，所以是个比较复杂的问题，同时也容易造成相同的依赖冲突。

虽然Google爸爸这么说，但是加入依赖信息会使我们使用起来方便很多，只要引用我们的库，就可以把其他依赖的库引用进来。那怎么把依赖信息打进pom文件呢？ (๑•̀ㅂ•́)و✧

## 骚操作

首先看下常规操作所用的插件

```groovy
classpath 'com.jfrog.bintray.gradle:gradle-bintray-plugin:1.0'
classpath 'com.github.dcendents:android-maven-gradle-plugin:1.4.1'
```

这两个插件的官网

[jfrog.bintray](https://github.com/bintray/gradle-bintray-plugin)，这个个人理解是上传到jcenter的插件

[android-maven-gradle-plugin](https://github.com/dcendents/android-maven-gradle-plugin)，maven adnroid aar打包插件

可以看到android-maven-gradle-plugin对这个插件的描述是已经过时的，这个插件默认是不把dependency信息打进pom文件的。

so，我们抛弃android-maven-gradle-plugin插件，使用maven插件，这是关键，对于jfrog.bintray如何结合maven使用,在[jfrog.bintray](https://github.com/bintray/gradle-bintray-plugin)上有详细的描述和demo。

直接看gradle pluin 3.0的[demo](https://github.com/bintray/bintray-examples/blob/master/gradle-bintray-plugin-examples/android-gradle-3.0.0-maven-example/app/publish.gradle)，这个demo有两个坑。

### 第一，

使用

```groovy
user = project.hasProperty('bintrayUser') ?: System.getenv('BINTRAY_USER')
key = project.hasProperty('bintrayApiKey') ?: System.getenv('BINTRAY_API_KEY')
```

是读取不到local.properties里面的内容的

正确姿势：

```groovy
Properties propertyReader = new Properties()
propertyReader.load(new FileInputStream("${rootDir}${File.separator}local.properties"))
user = propertyReader.bintrayUser.toString()
key = propertyReader.bintrayApiKey.toString()
```

### 第二,

需要把`dryRun = true`去掉,文档解释：

```
dryRun = false //[Default: false] Whether to run this as dry-run, without deploying
```

这个demo仔细看应该是开发人员随便写的，没有验证过，这两个坑需要改过来，可以直接参照我的commonlib的[upload.gradle](https://github.com/sonicers/commonlib/blob/master/upload.gradle),这个脚本还额外加了sources和javadoc的上传，符合jcenter的规范。另外一些路径的东西需要根据自己的具体配置修改，这里不赘述。

## 其他

使用maven插件可以自定义写pom文件，通过一些本地配置去控制写dependency或者不写，这里没有示例，有兴趣可以自行研究。

如果是上传到自己的pixel仓库需要自己去修改一些脚本的配置，暂时没做过，我就不吹牛逼了。

另外，非常感谢文中链接的作者。站在巨人的肩膀上٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ

## 扩展链接

[利用 gradle 多 aar 发布私有 maven](https://xiaozhuanlan.com/topic/2981475360)