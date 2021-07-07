---
title: Hexo博客搭建的一些经验
date: 2019-6-12
categories: Tech
tags:
   - Hexo
---

# 评论系统

评论系统的选择比较担心的什么时候会失效。

用过gittalk每篇文章都要手动新建一个issue很麻烦，韩国的那个又一直申请不上，他们的网站有问题，所以这里选用valine。

心态要好，添加这种评论系统并不复杂。[参考](https://github.com/iponkan/iponkan.github.io/commit/5ed3a7eda5a04e603686c53e4be83e54b336c9f0)

# 又拍云联盟logo添加

参考这个[commit](https://github.com/iponkan/iponkan.github.io/commit/5bc96f91115ca013bf92f2ed751f4c538d1f01f7)

加入又拍云联盟可以每个月获取免费空间和CDN加速，我现在[博客](https://sonicers.com/)就是放在又拍云上，是不是很快呀

# 添加备案信息

[添加备案信息](https://github.com/iponkan/iponkan.github.io/commit/455fad5af7dc2bc3e34270cf8fb5693df33df2ed)

# 删除不想要的东西

- 删除文章更新时间 ，config.yaml里修改
- [删除文章总计](https://github.com/theme-next/hexo-theme-next/issues/1652)

# 微信分享

# 关于部署

GitHub部署是有延迟的，一般会有几分钟。gitee有个发布模式，只要手动发布一下就可以更新，这点我觉得gitee做的比较好。

# 添加音乐播放功能

要在packjson加一个插件aplayer，然后添加音乐的方式很简单,在markdown相应位置加上就行

```markdown
{% aplayer "Cannon In D Major" "dylanf" "https://uss.sonicers.com/blog/cannon.mp3"  "http://uss.sonicers.com/blog/cannon.jpeg" %}
```

# 添加视频播放功能

视频可以直接引用b站视频

```markdown
{% raw %}

<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">
    <iframe src="//player.bilibili.com/player.html?aid=46303362&cid=81124889&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;">
    </iframe>
</div>

{% endraw %}
```



# 图片与文章放在同一路径做法

首先要

```yaml
post_asset_folder: true
```

然后参考[这篇](https://raw.githubusercontent.com/iponkan/iponkan.github.io/hexo/source/_posts/Android%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2%E7%A0%94%E7%A9%B6.md)文章的做法放在同名文件夹下即可。

