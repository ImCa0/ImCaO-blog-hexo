---
title: 你变成我，我变成你，我们便相遇了。
date: 2021-03-11 19:59:17
tags:
  - 链表
categories:
  - 算法
cover: https://npm.elemecdn.com/imcao-hexo/source/assets/covers/YourName.jpg
copyright_author: 皮卡澄
copyright_url: https://leetcode-cn.com/problems/intersection-of-two-linked-lists-lcci/solution/ni-de-ming-zi-ni-bian-cheng-wo-wo-bian-c-q56d/
---

## 原题

这是一道链表的题，原题如下：

给定两个（单向）链表，判定它们是否相交并返回交点。请注意相交的定义基于节点的引用，而不是基于节点的值。换句话说，如果一个链表的第 k 个节点与另一个链表的第 j 个节点是同一节点（引用完全相同），则这两个链表相交。

### 示例 1：

```
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
输出：Reference of the node with value = 8
输入解释：相交节点的值为 8 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
```

### 示例 2：

```
输入：intersectVal = 2, listA = [0,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
输出：Reference of the node with value = 2
输入解释：相交节点的值为 2 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [0,9,1,2,4]，链表 B 为 [3,2,4]。在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
```

### 示例 3：

```
输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：null
输入解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
解释：这两个链表不相交，因此返回 null。
```

### 注意：

如果两个链表没有交点，返回 `null` 。

在返回结果后，两个链表仍须保持原有的结构。

可假定整个链表结构中没有循环。

程序尽量满足 `O(n)` 时间复杂度，且仅用 `O(1)` 内存。

## 解题思路

你变成我，我变成你，我们便相遇了。

那么为什么能相遇呢？

1. 设长链表 A 长度为 LA，短链表长度 LB；
2. 由于速度相同，则在长链表 A 走完 LA 长度时，短链表 B 已经反过头在 A 上走了 LA-LB 的长度，剩余要走的长度为 LA-(LA-LB) = LB；
3. 之后长链表 A 要反过头在 B 上走，剩余要走的长度也是 LB；
4. 也就是说目前两个链表“对齐”了。因此，接下来遇到的第一个相同节点便是两个链表的交点。

那如果两个链表不存在交点呢？

答：这样的话第 4 步就会一直执行到两个链表的末尾，la,lb 都为 null,也会跳出循环，返回 null。

## 代码

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode la = headA;
        ListNode lb = headB;
        while(la != lb){
            //到达链表末尾时，重新走另一条链表的路
            la = la == null ? headB : la.next;
            lb = lb == null ? headA : lb.next;
        }
        return la;
    }
}
```
