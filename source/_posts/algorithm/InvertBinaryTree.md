---
title: 谷歌入门题——翻转二叉树
date: 2021-03-22 16:30:17
tags:
  - 树
categories:
  - 算法
cover: /assets/covers/LeetCode.png
---

## 原题

翻转一棵二叉树。

### 示例：

![InvertBinaryTree](./problem.jpg)

```
输入: root = [4,2,7,1,3,6,9]
输出: [4,7,2,9,6,3,1]
```

## 梗

众所周知，字越少，事越大。题越短，梗越大。

翻转一棵二叉树。一看题目就知道是一道非常经典的题了。

为什么说梗越大呢。Max Howell 大神在推特上吐槽自己因为没写出翻转二叉树，被谷歌拒了。

![twitter](./twitter.png)

而就在第二天 LeetCode 就加入了这道题，并把难度定位 Easy。

![easy](./easy.jpg)

![leetcode](./leetcode.jpg)

## 解题思路

递归法。

- 自顶向下
- 自底向上

递归的题只可意会，不可言传，看代码就完了。

## 代码

### 自顶向下

```java
public static TreeNode invertTree(TreeNode root) {
    // 递归触底返回 null
    if (root == null) {
        return null;
    }
    // 若无子节点 无需交换 直接返回本身（这步可省）
    if (root.left == null && root.right == null) {
        return root;
    }
    // 交换左右节点
    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;
    // 递归调用
    invertTree(root.left);
    invertTree(root.right);
    return root;
}
```

### 自底向上

```java
public static TreeNode invertTree(TreeNode root) {
    // 触底反弹
    if (root == null) {
        return null;
    }
    // 交换两个子节点 递归返回的是翻转完的子节点
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
}
```

## 小结

第一次做树的题，这类题十有八九会用到递归，还不是很熟悉，看着代码也要想半天才想明白。以上两种方法分别是前序遍历和后序遍历，都属于 DFS （深度优先搜索），看解答还可以用层序遍历的方式遍历二叉树，也就是 BFS （广度优先搜索），到时候做到这两个算法了再回来看吧。
