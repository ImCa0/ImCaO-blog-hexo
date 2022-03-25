---
title: ECharts初体验及Footprint上线
date: 2021-04-09 16:05:59
tags:
  - 前端
  - 科研
  - 博客
categories:
  - 我的开发
cover: https://npm.elemecdn.com/imcao-hexo/source/assets/covers/footprint.jpg
---

## ECharts

前两天开始做云平台的监管模块了，就是一大堆的图表。vue-element-admin 这个模板提供了很多图表的案例，都是基于 ECharts.js 开发的。

![1](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/echarts/1.jpg)

ECharts 是百度公司开发的一个基于 JavaScript 的开源可视化图表库，目前正在 Apache 开源基金会孵化中。[Apache ECharts](https://echarts.apache.org/zh/index.html)

ECharts 的功能非常强大，几乎可以用它制作任意类型的图表，甚至还能用来创建三维模型。[3D 地球](https://echarts.apache.org/examples/zh/editor.html?c=iron-globe&gl=1)

而我只是用它来画一些折线图、柱状图、饼图什么的，虽然看似简单，但还是有好多 API 要学。

## Footprint

工作之余的摸鱼时间，我想起了之前一直想做的旅行地图。最初是在别人的博客里看到的，看着挺炫酷的，想自己也整一个。

翻了好久别人的博客，终于找到了，审查元素一看，用的是一个叫 jvectormap 的 js 地图插件，最开始还以为一个 Vue 的插件。上它官网一看，发现是一个很老的地图插件了，官方文档也只有英文的，就没用它。

后来想起来之前云平台用的 ECharts 不就可以用来做地图吗，一查果然有用它来做足迹的案例，就照着教程开始做。下了 echarts.js 和 china.js 两个文件，然后把自己的数据写在 scripts 里，本地一运行成功了，然后再把三个 js 引入到 MarkDown 里，一部署却报错了，`ECharts is not loaded` 想了半天不知道什么问题，把三个文件合一起了再一试就成功了，MarkDown 里解析 js 的顺序可能跟 HTML 不太一样。

![2](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/echarts/2.jpg)

[足迹](https://www.imcao.cn/footprint)

## 被迫升级

足迹做完了，发现 vuepress-theme-reco 里没有适合的 icon。看了官方文档说支持 font-awesome，但好像我现在用的 1.5.7 版本不支持，所以被迫升了级，现在博客用的是最新的 1.6.6 版本了，足迹的 icon 也成功改成了定位图标。
