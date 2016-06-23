# 位图

> 原文转载自[董西成的博客](http://dongxicheng.org/structure/bitmap/)，使用Markdown重新排版

## 概述

位图（bitmap）是一种非常常用的结构，在索引，数据压缩等方面有广泛应用。本文介绍了位图的实现方法及其应用场景。

## 位图实现

![http://dongxicheng.org/wp-content/uploads/2011/05/bitmap.jpg](http://dongxicheng.org/wp-content/uploads/2011/05/bitmap.jpg)

###  自己实现

在位图中，每个元素为“0”或“1”，表示其对应的元素不存在或者存在。

```cpp
#define INT_BITS sizeof(int)
 
#define SHIFT 5 // 2^5=32
 
#define MASK 0x1f // 2^5=32
 
#define MAX 1024*1024*1024 //max number
 
int bitmap[MAX / INT_BITS];
 
/*
 
* 设置第i位
 
* i >> SHIFT 相当于 i / (2 ^ SHIFT),
 
* i&MASK相当于mod操作 m mod n 运算
 
*/
 
void set(int i) {
 
bitmap[i >> SHIFT] |= 1 << (i & MASK);
 
}
 
//获取第i位
 
int test(int i) {
 
return bitmap[i >> SHIFT] & (1 << (i & MASK));
 
}
 
//清除第i位
 
int clear(int i) {
 
return bitmap[i >> SHIFT] & ~(1 << (i & MASK));
 
}
```

### （2）函数库实现

C++的STL中有bitmap类，它提供了很多方法，详见：[http://www.cplusplus.com/reference/stl/bitset/](http://www.cplusplus.com/reference/stl/bitset/)

## 位图应用

### 枚举

#### （1）全组合

字符串全组合枚举（对于长度为n的字符串，组合方式有2^n种），如：abcdef,可以构造一个从字符串到二进制的映射关系，通过枚举二进制来进行全排序。

null——> 000000
f——> 000001
e——> 000010
ef——> 000011
……
abcedf——> 111111

#### （2）哈米尔顿距离

![http://dongxicheng.org/wp-content/uploads/2011/05/hamierdun.jpg](http://dongxicheng.org/wp-content/uploads/2011/05/hamierdun.jpg)

枚举算法，复杂度是O(N^2)，怎样降低复杂度呢？如果是N 个二维的点，那么我们可以怎么用较快的方法求出

![http://dongxicheng.org/wp-content/uploads/2011/05/formula.jpg](http://dongxicheng.org/wp-content/uploads/2011/05/formula.jpg)

通过简单的数学变形，我们可以得到这样的数学公式：

![http://dongxicheng.org/wp-content/uploads/2011/05/formula_total.jpg](http://dongxicheng.org/wp-content/uploads/2011/05/formula_total.jpg)

通过观察，我们发现每一对相同元的符号必定相反，如：x_i-y_i，于是我们有了一个二进制思想的思路，那就是枚举这些二i维的点的x 轴y 轴前的正负号，这样就可以用一个0~3 的数的二进制形式来表示每个元素前面的正负号，1表示+号，0表示−号，如：2 表示的二进制位形式为10表示x_i-y_i。这样我们就可以通过2^2*N次记录下这些二元组的不同的符号的数值，对于每个二进制来表示的不同的式子只需记录下他们的值，这样我们只需求max_i 和min_i出这些相同的二进制表示的式子max_i –min_i，最后我们就可以解出ans=max{max_i-min_i}。

通过位图，算法时间复杂度可将为O(N)。

### 搜索

设计搜索剪枝时，需要保存已经搜索过的历史信息，有些情况下，可以使用位图减小历史信息数据所占空间。

### 压缩

- 在2.5亿个整数中找出不重复的整数，注，内存不足以容纳这2.5亿个整数？
- 腾讯面试题：给40亿个不重复的unsigned int的整数，没排过序的，然后再给一个数，如何快速判断这个数是否在那40亿个数当中？

## 总结

Bitmap是一种非常简洁快速的数据结构，他能同使证存储空间和速度最优化（而不必空间换时间）。

## 参考资料

- [《C实现bitmap位图》](http://blog.csdn.net/QIBAOYUAN/archive/2010/09/29/5914662.aspx)
- [武森《浅谈信息学竞赛中的“0”和“1”》](https://www.google.co.jp/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=%E6%B5%85%E8%B0%88%E4%BF%A1%E6%81%AF%E5%AD%A6%E7%AB%9E%E8%B5%9B%E4%B8%AD%E7%9A%84%E2%80%9C0%E2%80%9D%E5%92%8C%E2%80%9C1%E2%80%9D)
