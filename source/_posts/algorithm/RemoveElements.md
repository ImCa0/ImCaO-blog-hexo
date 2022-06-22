---
title: 哨兵节点——标准工具人
date: 2021-03-15 14:28:55
tags:
  - 链表
categories:
  - 算法刷题
cover: RemoveElements.jpg
---

## 原题

这还是一道链表题，原题如下：

给你一个链表的头节点 `head` 和一个整数 `val` ，请你删除链表中所有满足 `Node.val == val` 的节点，并返回新的头节点 。

### 示例 1：

![1](source@/1.jpg)

```
输入：head = [1,2,6,3,4,5,6], val = 6
输出：[1,2,3,4,5]
```

### **示例 2：**

```
输入：head = [], val = 1
输出：[]
```

### **示例 3：**

```
输入：head = [7,7,7,7], val = 7
输出：[]
```

## 解题思路

### 常规解法

如果删除的节点是中间的节点，则问题似乎非常简单：

- 选择要删除节点的前一个结点 `prev`。
- 将 `prev` 的 `next` 设置为要删除结点的 `next`。

![2](source@/2.jpg)

当要删除的一个或多个节点位于链表的头部时，事情会变得复杂。

![3](source@/3.jpg)

首先要用一个 while 循环对头节点进行判断，删除所有头部要删除的节点，在按上述方法删除中间的节点。具体代码如下：

```java
public static ListNode myRemoveElements(ListNode head, int val) {
    // 删除头节点
    while (head != null) {
        if (head.val == val) {
            head = head.next;
        } else {
            break;
        }
    }
    // 正常判断next
    ListNode current = head;
    while (current != null && current.next != null) {
        if (current.next.val == val) {
            current.next = current.next.next;
        } else {
            current = current.next;
        }
    }
    return head;
}
```

### 哨兵节点解法

引入哨兵节点，无需再分步判断头节点和中间节点了。

哨兵节点广泛应用于树和链表中，如伪头、伪尾、标记等，它们是纯功能的，通常不保存任何数据，其主要目的是使链表标准化，如使链表永不为空、永不无头、简化插入和删除。**即标准的工具人。**

![4](source@/4.jpg)

在这里哨兵节点将被用于伪头。

算法：

- 初始化哨兵节点为 `ListNode(0)` 且设置 `sentinel.next = head`。
- 初始化两个指针 `curr` 和 `prev` 指向当前节点和前继节点。
- 当 `curr != nullptr`：
  - 比较当前节点和要删除的节点：
    - 若当前节点就是要删除的节点：则 `prev.next = curr.next`。
    - 否则设 `prve = curr`。
  - 遍历下一个元素：`curr = curr.next`。
- 返回 `sentinel.next`。

```java
public static ListNode removeElements(ListNode head, int val) {
    ListNode sentinel = new ListNode(0);
    sentinel.next = head;

    ListNode prev = sentinel, curr = head;
    while (curr != null) {
        if (curr.val == val) prev.next = curr.next;
        else prev = curr;
        curr = curr.next;
    }
    return sentinel.next;
}
```

## 原题链接

[移除链表元素](https://leetcode-cn.com/problems/remove-linked-list-elements/solution/yi-chu-lian-biao-yuan-su-by-leetcode/)

## 题外话

至此，已经完成了 LeetCode 上动态规划、双指针、链表的所有简单题，加起来也不过 50 多道吧。之后可能会换一个类型的题目继续，也可能会先去学一些新的东西。今天中午午睡醒来看到了一篇讲 Docker 的文章，想去学一下，趁着服务器还没过期要多学一些运维的东西，到时候学成了还能把这个 Blog 放到 Docker 里。٩(˃̶͈̀௰˂̶͈́)و
