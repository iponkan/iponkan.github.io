---
titie: 自学前端开发之一-Javascript和Node.js
date: 2021-07-13
categories: Tech
tags:	
	- 前端
---

我学习前端初衷是想在在微信上开发一个H5页面。我没有从基础的html+js+css开始学起，反而一开始就去使用尝试使用React和Vue框架，最后先选择了Vue。现在想想确实给自己加了一些难度上去，没有规划好循序渐进的学习路线。好在，前端的技术和移动端有很多相似之处，之前在搭建Hexo博客的时候也对脚手架有所了解，所以，第一篇在学会使用Vue之前，梳理一下Vue脚手架搭建的基础，Javascript和Node.js.

<!-- more -->

# Javascript

更快掌握新知识的方法之一，就是与老知识对比。Javascript是一门脚本语言，但也不妨将它与Java做一下对比。

*Javascript和java的关系就像雷峰塔和雷锋之间的关系。*

# Javascript与Node.js

Node.js是怎么发展起来的呢。首先要先了解的一点是，原来javascript只是运行在浏览器上的脚本语言，主要用于前端页面的逻辑处理。得益于前端的蓬勃发展，javascript不断发展和完善，后来出现了一个转折点。

Google的V8引擎的出现！

得益于V8引擎执行Javascript的速度非常快，性能非常好，JavaScript开始用来写后端代码，Node.js 就是运行在服务端的 JavaScript，你可以理解成java中的JDK。这样子其实前后端的技术在一定程度上实现了融合。

# Node.js的使用

Node.js有很多版本，推荐使用nvm来下载Node.js并实现版本管理，nvm同时支持Windows和Mac。

成功下载Node.js后可以使用npm进行依赖库软件包的管理（也可以用yarn，比npm好用），npm继承了传统包管理工具，如curl，wget，homebrew，apt-get等的优良传统，可以方便管理依赖库，软件包等。但也是因为仓库都在外网所以下载速度慢，可以通过设置国内镜像来加快速度，完整设置可以参考我的[gist](https://gist.github.com/iponkan/b82c53bfdfa58469d5127108c932be03)，不过我建议你参考我之前科学上网的文章，一劳永逸。

## npx

npx的概念就是你可以执行网上的npm工程，得到输出结果。其实可以看出，node的应用通常js库都是npm拉取，然后运行。npx就是把这两步步骤结合起来，这样子不必将1.项目clone下来 2.npm install 3.npm run .例如

```shell
npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32
git@gist.github.com:4bc19503fe9e9309e2bfaa2c58074d32.git
```

注意：这里的例子是用gist，应该也可以用github，这里最好是设置代理，因为npx命令无非是通过下载package.json里面的依赖包，然后执行脚本的类似于run的命令。所以，科学上网多么的重要！

# 参考资料

## [node.js和JavaScript的关系](https://www.cnblogs.com/thinkam/p/8262743.html)