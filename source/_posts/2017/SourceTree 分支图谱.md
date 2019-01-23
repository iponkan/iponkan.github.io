---
title: SourceTree 分支图谱
date: 2017-08-13
categories: Git
tags:
   - Git
   - SourceTree
---
- 转自:[慢慢牛 SourceTree 分支图谱](http://timebridge.space/2017/03/07/SourceTree-%E5%88%86%E6%94%AF%E5%9B%BE%E8%B0%B1/)

<!-- more -->

用 [SourceTree](https://www.sourcetreeapp.com/) 一段时间了，一般用来做一下提交文件的 review，除此之外没怎么关注过其他功能。因为工作需要今天来看一下它的分支图谱功能：它用于展示一个 Git 仓库中分支的提交和操作情况。实际上 Git 本身就有这样的功能，执行命令`git log --graph --decorate --oneline --simplify-by-decoration --all`即可，或者使用 git 提供的图形化工具就好。那么 SourceTree 是怎么玩的呢？

初始分支情况如下：

[![分支查看](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-1.png)](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-1.png)

如上图，显示的是所有分支的提交情况，是经过以下提交记录之后的图谱：

1）新建仓库，在 `master` 上提交 `master_a`、`master_b`记录；

2）切出 `branchA` 分支，并提交 `branchA_c`记录；

3）切到 `master` 分支，提交 `master_d`记录；

4）切出 `branchB` 分支，提交 `branchB_e` 记录；

5）切到 `branchA` 分支，提交 `branchA_f` 记录；

6）切到 `master` 分支，提交 `master_g` 记录；

提交记录以 **分支名 + 下划线 + 顺序字母** 来表示，可以看出具体提交在哪个分支上以及提交的顺序。

把分支切到 `branchB`：

[![分支查看](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-2.png)](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-2.png)

可以看到整个图谱线条并没有变化，只是高亮点从原先 `master_g` 记录切换到了 `branchB_e` 记录。

把分支切换到分支 `branchB`，并提交记录 `branchB_g`：

[![分支查看](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-3.png)](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-3.png)

图谱变化，高亮点又回到最左边竖线的顶部。由此可见：**整个图谱的点从下往上是按照提交记录的时间来排列的，最左边的线代表着最近有活动的分支**。

在 `master` 分支上对 `branchA` 执行 merge 操作：

[![分支查看](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-4.png)](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-4.png)

这里有两点变化：

1. 因为是在 `master` 分支上执行的操作，因此最近有变化的分支就变成 `master`，最左边的线自然变成 `master` 分支，这也印证了前面的结论；
2. 粉红色的线并入 `master` 分支，但是标记有 `branchA` 的粉红色色块并没有和标记有 `master` 的蓝色色块放到一块去；

切到 `branchA` 分支，提交 `branchA_i` 记录：

[![分支查看](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-5.png)](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-5.png)

首先最左边变成了分支 `branchA`，其次 `branchA` 分支的线分叉了，一部分连接到最顶部的高亮点，一部分连接到表示 `master` 分支的粉色线，这也符合我们之前的操作记录。

切到 `master` 分支，并提交 `master_j` 操作：

[![分支查看](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-7.png)](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-7.png)

`master` 分支又跑到了最左边，能清晰的看到如下变化：`branchA` （粉色线）在记录 `branchA_f` 之后合并了一次到 `master` 分支，之后继续提交了 `branchA_i` 记录。

切到 `branchB`，对 `master` 分支执行 rebase 操作：

[![分支查看](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-8.png)](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-8.png)

可以看到此时黄色的线消失了，似乎只有两个分支了，但实际不是。注意看最左边的线，此时变成了 `branchB`，`master` 分支也在这条线上，注意看灰色那行。

切到 `master` 分支，切出新的分支 `branchC`、`branchD`：

[![分支查看](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-9.png)](http://7xktd8.com1.z0.glb.clouddn.com/%E5%88%86%E6%94%AF%E6%9F%A5%E7%9C%8B-9.png)

可以看到灰色那行，原先代表 `master` 分支的最新节点，右边只有一个标有 `master` 的蓝色色块，现在有三个色块了，加了 `branchC`、`branchD` 两个。

针对 **全部分支** 总结一下：

1. 每一条线代表一个分支，分支上的点代表着一次提交，最新的提交记录右侧会带有一个色块，标记这条线代表哪个分支，有时候一个点会代表多个分支，因此会有多个色块；
2. 整个图谱的点从下往上是按照提交记录的时间来排列的，最左边的线代表着最近有活动的分支；
3. 线交汇代表分支合并，分叉代表切出新分支；

以上基本就是看懂分支图谱所需要的知识。除了”全部分支” 视图，还可以任意切换到某个分支，查看这个分支的视图，两种视图唯一的不同就是分支视图下最左边的线代表选中的分支（其实也是最近有活动的分支，只不过上下文不一样）。