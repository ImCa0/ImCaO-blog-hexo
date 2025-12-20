---
title: 第一个 Vue + Spring Boot 前后端分离项目开发第一阶段小结
date: 2021-03-31 21:25:53
tags:
  - 前端
  - 后端
  - 科研
  - Vue
  - Spring Boot
categories:
  - 我的开发
cover: /assets/covers/vue-spring.jpg
---

## 前言

研一开学就说要做的工业互联网云制造平台终于动工了。

首先简单介绍一下云平台的功能，平台主要参照[速加网](https://www.sogaa.net/)的模式，为制造商和客户提供服务，制造商接入制造资源，用户发布制造任务，平台则提供资源管理、需求估价、任务匹配等服务。

我负责开发的是制造商的后台管理部分。现在暂且定了三大内容，第一、制造资源的接入模块；第二、加工任务模块；第三、制造资源的监管模块。

第一块内容学姐已经做完了，但是是基于 JS 开发的，而整个云平台要求用 Vue + SpringBoot 开发，所以需要修改项目框架，花了一周时间，完成了整个项目的复现。

![5](/assets/posts/FirstVueSpringboot/5.jpg)

![6](/assets/posts/FirstVueSpringboot/6.jpg)

第一次用 Vue + SpringBoot 开发，还是遇到了很多问题，所以做个小结。

## 前端

之前只是学习了一些 Vue 的基础知识，并没有实际试着写页面，也没感受过它的特别之处。

### 模块化开发

做完平台的第一部分，明白了模块化开发的精髓，一个页面中包含多个模块，开发时只需要考虑本模块实现的功能，并且数据和路由全部封装在模块里，大大降低了耦合性。

![1](/assets/posts/FirstVueSpringboot/1.jpg)

### 数据

前端数据不再直接死板，从后端接收的数据以变量的形式储存下来，必要时还能进行修改，像后端发送的数据也不局限于表单内容，可以通过前端定义的变量自由定义提交的数据结构。

![2](/assets/posts/FirstVueSpringboot/2.jpg)

## 后端

后端开发已经很熟练了，就是从 Mapper 到 Service 再到 Controller，但在前后端分离时也有所不同。

### 跨域请求

既然前后端分离了，就要配置跨越请求，其实还是不太明白背后的实现原理，先暂时能用就行了。

![3](/assets/posts/FirstVueSpringboot/3.jpg)

### 实体类

原本的实力类只有对应数据库的 POJO(Plain Ordinary Java Object) 现在还要加入与前端通信用的 Vo，定义了数据交换的结构。

![4](/assets/posts/FirstVueSpringboot/4.jpg)

## 部署

今天把项目部署到了自己的服务器上，期间遇到了一个问题。

https 中不能发 http 请求。因为后端部署在 9001 端口，没有 https 证书，所以前端即使在 8080 有 ssl 证书的情况下也不用 https 访问。

项目地址：[http://www.imcao.cn:8080/ess](http://www.imcao.cn:8080/ess)

## 后记

之后打算开始做监管模块，因为任务模块要考虑到与客户和平台的数据交互，现在还没有定下数据库的格式，所以还很难下手。监管模块只考虑制造商的制造资源，但也没定具体的数据结构，就先参考首页的 dashboard 做一个前端的设计。

![7](/assets/posts/FirstVueSpringboot/7.jpg)
