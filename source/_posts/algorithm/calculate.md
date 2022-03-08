---
title: 基本计算器问题的双栈通用解法
date: 2022-02-24 20:04:57
tags:
  - 栈
categories:
  - 算法
cover: /assets/covers/calculate.jpg
copyright_author: 宫水三叶
copyright_url: https://leetcode-cn.com/problems/basic-calculator-ii/solution/shi-yong-shuang-zhan-jie-jue-jiu-ji-biao-c65k/
---

## 题目

给你一个字符串表达式 `s` ，请你实现一个基本计算器来计算并返回它的值。

整数除法仅保留整数部分。

> **示例 1：**
> 输入：s = "(1+(4+5+2)-3)+(6+8)"
> 输出：23

> **示例 2：**
> 输入：s = " 3+5 / 2 "
> 输出：5

## 说明

这一类题有多种变式，如 [224. 基本计算器](https://leetcode-cn.com/problems/basic-calculator/) 中表达式只含有 `+`, `-` 和 `()`，[227. 基本计算器 II](https://leetcode-cn.com/problems/basic-calculator-ii/) 中含有 `+`, `-`, `*`, `/`，[772. 基本计算器 III](https://leetcode-cn.com/problems/basic-calculator-iii/) 中含有 `+`,`-`, `*`, `/` 以及 `()`。本文介绍的双栈通用解法适用于以上所有题目。

## 算法流程

首先创建两个栈 `nums` 和 `ops`，分别存放表达式中的数字和操作符。

然后从前往后遍历表达式，对于遍历到的字符做分类讨论。

- 空格：跳过
- `(`：加入到 `ops` 中，等待与之匹配的 `)`
- `)`：使用现有的 `nums` 和 `ops` 进行计算，直到遇到左边最近的一个左括号为止，计算结果放回到 `nums`
- 数字 : 从当前位置开始继续往后取，将整一个连续数字整体取出，加入 `nums`
- 运算符：加入到 `ops` 中。在加入之前先把栈内可以算的都算掉（只有「栈内运算符」比「当前运算符」优先级高/同等，才进行运算），使用现有的 `nums` 和 `ops` 进行计算，直到没有操作或者遇到左括号，计算结果放到 `nums`

其中， **只有「栈内运算符」比「当前运算符」优先级高/同等，才进行运算** 的意思是：

假设当前已经扫描到了 `2 + 1`（此时栈内的操作为 `+` ）。

- 如果后面出现的 `+ 2` 或者 `- 1` 的话，满足「栈内运算符」比「当前运算符」优先级高/同等，可以将 `2 + 1` 算掉，把结果放到 `nums` 中；
- 如果后面出现的是 `* 2` 或者 `/ 1` 的话，不满足「栈内运算符」比「当前运算符」优先级高/同等，这时候不能计算 `2 + 1`。

一些细节：

- 由于第一个数可能是负数，为了减少边界判断。一个小技巧是先往 `nums` 添加一个 `0`
- 为防止 () 内出现的首个字符为运算符，将所有的空格去掉，并将 `(-` 替换为 `(0-`，`(+` 替换为 `(0+`（当然也可以不进行这样的预处理，将这个处理逻辑放到循环里去做）

## 代码

```java
class Solution {
  public int calculate(String s) {
    // 使用一个 Map 来维护运算符的优先级
    Map<Character, Integer> map = new HashMap<>();
    map.put('-', 1);
    map.put('+', 1);
    map.put('*', 2);
    map.put('/', 2);
    ArrayDeque<Integer> nums = new ArrayDeque<>();
    ArrayDeque<Character> ops = new ArrayDeque<>();
    // 防止第一个字符是负号，现在 nums 中添加一个 0
    nums.addLast(0);
    // 去掉所有空格
    s = s.replace(" ", "");
    char[] cs = s.toCharArray();
    for (int i = 0; i < cs.length; i++) {
      char c = cs[i];
      if (c == '(') {
        ops.addLast(c);
      } else if (c == ')') {
        // 运算 直到碰到与之对应的 (
        while (ops.peekLast() != '(') {
          calc(nums, ops);
        }
        // 运算完将 ( 弹出
        ops.pollLast();
      } else if (isNum(c)) {
        int sum = 0;
        int j = i;
        // 将数字整体取出
        while (j < cs.length && isNum(cs[j])) {
          sum = sum * 10 + (cs[j] - '0');
          j++;
        }
        nums.addLast(sum);
        // 遍历下标前移
        i = j - 1;
      } else {
        // 在特殊情况 (- 或 (+ 中加上 0
        if (i > 0 && cs[i - 1] == '(') {
          nums.addLast(0);
        }
        // 将运算符加入 ops 前先把能算的算完
        while (!ops.isEmpty() && ops.peekLast() != '(') {
          char prev = ops.peekLast();
          // 判断上一个运算符与当前的优先级关系
          if (map.get(prev) >= map.get(c)) {
            calc(nums, ops);
          } else {
            break;
          }
        }
        // 将运算符加入 ops
        ops.addLast(c);
      }
    }
    // 遍历结束 完成剩余运算
    while (!ops.isEmpty()) {
      calc(nums, ops);
    }
    return nums.peekLast();
  }


  void calc(ArrayDeque<Integer> nums, ArrayDeque<Character> ops) {
    // 数字数量小于 2 或运算符数量等于 0，不进行运算
    if (nums.size() < 2)
      return;
    if (ops.isEmpty())
      return;
    // 弹出两个数字
    int b = nums.pollLast();
    int a = nums.pollLast();
    // 弹出一个运算符
    char o = ops.pollLast();
    int c = 0;
    if (o == '-') {
      c = a - b;
    } else if (o == '+') {
      c = a + b;
    } else if (o == '*') {
      c = a * b;
    } else {
      c = a / b;
    }
    // 计算结果放回 nums
    nums.addLast(c);
  }

  boolean isNum(char c) {
    return Character.isDigit(c);
  }
}
```
