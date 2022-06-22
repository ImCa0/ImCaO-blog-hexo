---
title: CSS 选择器
date: 2021-05-11 10:35:32
tags:
  - 前端
  - CSS
categories:
  - 我的开发
cover: source@/assets/covers/selector.jpg
---

以下介绍 10 种常用的 CSS 选择器

## ID 选择器

`#` 号开头 + 自定名称

命名规则：首字符为英文字母（大小写皆可），第二个字符起可以是英文、数字、`-` 或 `_`

例：`#the-id-selector`

作用：选取拥有 id 属性并且其值为 `the-id-selector` 的 HTML 元素

特性：id 在 HTML 页面中唯一

## Class 选择器

`.` 号开头 + 自定名称

命名规则与 id 选择器相同

例：`.my-class`

作用：选取拥有 class 属性并且其值为 `my-class` 的 HTML 元素

特性：一个 class 可以用于多个 HTML 元素上，一个 HTML 元素可以设置多了 class 属性

## Tag 选择器

### 直接使用 HTML 标签名

例：`h1`

作用：选中所有标签为 h1 的元素

### 在 Tag 选择器后加上 ID 选择器或 Class 选择器

例：`div.container`

作用：选中 class 属性为 container 的 div 元素

## 空格

例：`.container div`

作用：选中 class 属性为 container 的 HTML 元素里面的所有 div 元素，不包括 container 本身

## `>` 号

例：`.container > div`

作用：选中 class 属性为 container 的 HTML 元素里面的第一层的 div 元素

## `+` 号

例：`.container + div`

作用：选中与 class 属性为 container 的 HTML 元素处于同一层并紧接着的 div，如果紧接着的不是 div，则不会选中任何东西

## `~` 号

例：`.container ~ div`

作用：选中与 class 属性为 container 的 HTML 元素处于同一层后面所有的 div

## `*` 号

例：`.container ~ *`

作用：选中 class 属性为 container 的 HTML 元素处于同一层后面所有的元素

## Attribute 选择器

例：`a[title]`

作用：选中所有拥有 title 属性的 a 元素

### 对属性值进行配对

例：`a[href="https://www.google.com"]`

作用：选中所有 href 属性为 https://www.google.com 的 a 元素

例：`a[href^="https"]`

作用：选中所有 href 属性开头为 https 的 a 元素

例：`a[href$=".com"]`

作用：选中所有 href 属性结尾为 .com 的 a 元素

例：`a[href*="google"]`

作用：选中所有 href 属性中包含 goolge 的 a 元素

> 属性值配对可用正则表达式

## 伪类 Pseudo Classes

例：`a:hover`

作用：设定鼠标移动到 a 元素上时候的样式

例：`.container div:nth-child(2)`

作用：选中 class 属性为 container 的 HTML 元素里面的第二个 div 元素

更多伪类的用法可参考[文档](https://www.w3school.com.cn/css/css_pseudo_classes.asp)
