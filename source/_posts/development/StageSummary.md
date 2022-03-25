---
title: 云制造企业后台管理系统开发阶段性小结
date: 2021-04-25 16:22:48
tags:
  - 科研
categories:
  - 开发
cover: https://npm.elemecdn.com/imcao-hexo/source/assets/covers/StageSummary.jpg
---

距第一阶段小结已经过去了将近一个月了。终于，这个云制造企业后台管理系统大体完工了。

## 项目介绍

项目主要分为三大部分，制造资源接入模块、制造任务模块和监管模块。

### 首页

首页利用 ECharts 图表库，实现制造过程数据的可视化。

![1](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/StageSummary/dashboard.png)

### 制造资源接入模块

该模块用于将制造资源接入到云制造平台，其原理参考了编程语言中类和对象的思想。企业管理人员首先添加制造资源类型信息，即创建“类”，其次对该类型创建制造资源实例，即创建“对象”。通过该方法可实现对制造资源属性的自定义。

![2](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/StageSummary/type.png)

![3](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/StageSummary/instance.png)

### 制造任务模块

该模块用于查看待接受、正在加工、已完成的制造任务。待接受页面中，企业管理人员可进行接受或拒绝任务的操作。正在加工页面中，可查看当前加工进度等信息。已完成页面中，可查看合格率和发货信息。

![4](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/StageSummary/to-be-accepted.png)

![5](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/StageSummary/processing.png)

![6](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/StageSummary/completed.png)

### 监管模块

该模块用于实时监管制造资源。可查看制造资源当前状态和当前任务信息，并且可以实时监控每个制造资源的能耗分析、负载状态等详细信息。

![7](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/StageSummary/monitor-home.png)

![8](https://npm.elemecdn.com/imcao-hexo/source/_posts/development/StageSummary/monitor-detail.png)

## 项目开发与部署

前端：Vue

前端模板：Vue-Element-Admin

后端：Java

后端框架：SpringBoot + MyBatis

部署地址：[云制造企业后台管理系统](https://www.imcao.cn/ess)
