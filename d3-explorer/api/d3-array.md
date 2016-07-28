# d3-array

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

**d3.variance(array[, accessor])**

计算数组数值方差，[参考公式](http://mathworld.wolfram.com/SampleVariance.html)。

> 如果数组长度小于2，则返回undefined。NaN和undefined元素会被忽略

**d3.deviation(array[, accessor])**

计算数组数值标准差，为方差的值开平方根。

## 转换

**d3.merge(arrays)**

合并数组

```js
let items = d3.merge([[1, 2], [3]])
// reutrn [1, 2, 3]
```

**d3.pairs(array)**

创建相邻对数组

```js
let items = d3.pairs([1, 2, 3, 4])
// return [[1, 2], [2, 3], [3, 4]]
```

**d3.permute(array, indexes)**

按指定索引重新排列数组

```js
d3.permute(["a", "b", "c"], [1, 2, 0])
// return ["b", "c", "a"]
```

> 也可以用于从对象中抽取指定的属性

```js
let object = {yield: 27, variety: "Manchuria", year: 1931, site: "University Farm"}
let fields = ["site", "variety", "yield"]
d3.permute(object, fields)
// return ["University Farm", "Manchuria", 27]
```

**d3.shuffle(array[, lo[, hi]])**

对数组“洗牌”，使用算法[Fisher–Yates Shuffle](https://bost.ocks.org/mike/shuffle/)

**d3.ticks(start, stop, count)**

返回一个长度约为`count + 1`间隔一致的数组，数组元素的值在start和stop之间

```js
d3.ticks(0, 100, 20)
// return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
```

**d3.tickStep(start, stop, count)**

计算元素间隔值

```js
d3.tickStep(0, 100, 20)
// 5
```

**d3.range([start, ]stop[, step])**

用于生成间隔一致的数值数组。step默认值为1，start默认值为0。

```js
d3.range(0, 1, 0.2)
// return [0, 0.2, 0.4, 0.6000000000000001, 0.8]
```

> 此方法返回的数组长度有可能出乎你的意料，如果对数组长度有要求，可以使用 d3.range(49).map(...)

**d3.transpose(matrix)**

对矩阵进行转置

```js
d3.transpose([[1, 2], [3, 4], [5, 6]])
// return [[1, 3, 5], [2, 4, 6]]
```

**d3.zip(arrays…)**

转置多个数组为一个二维数组(矩阵)

```js
d3.zip([1, 2], [3, 4])
// return [[1, 3], [2, 4]]
```
