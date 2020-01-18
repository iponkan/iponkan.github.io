---
title: Git
date: 2018-2-2
categories: Git
tags: Git
---

总结使用Git遇到的问题。

<!-- more -->

## 骚操作

### Cherry-Pick其他仓库

有时候两个仓库的代码十分相似，可能一开始就是从一个仓库分离出来的。对于我们的cherry-pick,他最常见的操作就是pick其他分支的提交。结合起来，可以将另外一个远程仓库添加为一个远程(Git可以有多个远程），然后把其他仓库的代码cherry-pick过来。

## 代理

让你的Git拉取Github代码速度飞起来。具体可以查看我翻墙文章中的Git部分。注意的是，如果你用的是国内的Git仓库需要手动把代理关掉。我是用ssh和http区分的，用http时不使用代理，使用ssh时使用代理。

## Git子模块



## SSH

非对称式加密

## Git 命令

```shell
git remote set-url origin [url] 
```

Andorid Studio用命令修改远程地址

## Github

[如何同步 Github fork 出来的分支](http://jinlong.github.io/2015/10/12/syncing-a-fork/)

https://blog.csdn.net/ziwang_/article/details/78498578

 [GIT 子模块 - Yihui Xie | 谢益辉](https://yihui.name/cn/2017/03/git-submodule/) 

 [github/gitlab同时管理多个ssh key | 前端学习踩过的坑](https://xuyuan923.github.io/2014/11/04/github-gitlab-ssh/) 

