# 在React的世界畅游d3 - 第一篇

> 本篇主要讲解SVG和d3的基础内容

在对数据进行可视化分析的时候，对数组进行操作是经常的事。`d3-array`就是专门干这个的。

## 统计类

**d3.min(array[, accessor])**

取数组的最小值，accessor函数相当于先对数组进行一次map

```js
let min = d3.min([2046, 9527, 3721])
// return 2046

let min = d3.min([{x: 1}, {x: -1}, {x: 5}], (item) => {
  return item.x
})
// return -1
```

`d3.max`刚好相反，取最大值。

> 需要注意的是，排序规则采用`natural order`，也就是字符串比较时"20"会比“3”小。

**d3.extent(array[, accessor])**

获取数组取值范围

```js
let pair = d3.extent([2046, 9527, 3721])
// return [2046, 9527]
```

> 需要注意的是，排序规则采用`natural order`，也就是字符串比较时"20"会比“3”小。

> 空数组会返回[undefined, undefined]

**d3.sum(array[, accessor])**

对数组数值求和。

> 空数组返回0，忽略NaN和undefined的值

**d3.mean(array[, accessor])**

对数组数值求平均值。

> 空数组返回undefined，忽略NaN和undefined的值

**d3.median(array[, accessor])**

对数组数值求中位数，使用[R-7 method](https://en.wikipedia.org/wiki/Quantile#Estimating_quantiles_from_a_sample)。

> 空数组返回undefined，忽略NaN和undefined的值

**d3.quantile(array, p[, accessor])**

对`已排序的数组`数值求p分位值。

```js
let a = [0, 10, 30]
d3.quantile(a, 0) // 0
d3.quantile(a, 0.5) // 10
d3.quantile(a, 1) // 30
d3.quantile(a, 0.25) // 5
d3.quantile(a, 0.75) // 20
d3.quantile(a, 0.1) // 2
```
