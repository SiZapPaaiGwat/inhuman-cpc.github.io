# d3-scale

比例尺在数据可视化的时候非常重要。它的基本运作方式和数学中的函数一样，就是输入一个定义域，返回一个值域。
根据定义域和值域是连续还是离散的，比例尺的类型也多种多样。

## 连续比例尺 (Continuous Scales)

连续刻度尺映射一组定义域到值域（定义域必须是数值，值域可以是字符串）。
如果值域也是数字，则可以倒置求定义域。

**continuous(value)**

这个方法不能直接使用，一般由其它方法调用而得来。

```js
let x = d3.scaleLinear()
  .domain([10, 130])
  .range([0, 960]);

x(20) // 80
x(50) // 320
```

**continuous.invert(value)**

通过值域求定义域

```js
let x = d3.scaleLinear()
  .domain([10, 130])
  .range([0, 960])

x.invert(80) // 20
x.invert(320) // 50
```

**continuous.domain([domain])**

设置定义域

> 定义域的排列必须是有序的（升序或降序均可），且长度不能小于2

```js
let color = d3.scaleLinear()
  .domain([-1, 0, 1])
  .range(["red", "white", "green"])

color(-0.5) // "rgb(255, 128, 128)"
color(+0.5) // "rgb(128, 192, 128)"
```

**continuous.range([range])**

设置值域

**continuous.rangeRound([range])**

设置值域，结果会四舍五入

**continuous.clamp(clamp)**

默认为false，用于控制定义域越界后的行为。设置为true以后，值会被收缩在值域范围内。

**continuous.ticks([count])**

设置或获取定义域内具有代表性的元素。count默认为10。
主要用于选取坐标轴刻度。

**continuous.tickFormat([count[, specifier]])**

设置定义域代表值的表现形式

```js
let x = d3.scaleLinear().domain([-1, 1]).range([0, 960])
let ticks = x.ticks(5)
let tickFormat = x.tickFormat(5, "+%")

ticks.map(tickFormat)
// ["-100%", "-50%", "+0%", "+50%", "+100%"]
```

**continuous.nice([count])**

将定义域范围扩展为比较理想的形式。

> 比如将[0.5000001, 0.8999]扩展成[0.5, 0.9]

**continuous.copy()**

返回比例尺副本

**d3.scaleLinear()**

返回线性比例尺

**d3.scalePow()**

返回指数比例尺，类似于数学函数：`y = mx^k + b`

**pow.exponent([exponent])**

设置指数，如果不设置就是一个线性比例尺

**d3.scaleSqrt()**

指数=0.5的指数比例尺

**d3.scaleLog()**

返回对数比例尺，类似于数学函数：`y = m log(x) + b`

**log.base([base])**

设置底数，默认为10

**d3.scaleTime()**

返回一个时间比例尺

```js
var x = d3.scaleTime()
  .domain([new Date(2000, 0, 1), new Date(2000, 0, 2)])
  .range([0, 960])

x(new Date(2000, 0, 1,  5)) // 200
x(new Date(2000, 0, 1, 16)) // 640
x.invert(200) // Sat Jan 01 2000 05:00:00 GMT-0800 (PST)
x.invert(640) // Sat Jan 01 2000 16:00:00 GMT-0800 (PST)
```

> 时间比例尺的API大体与continuous一致，某些有一些差别。

## 量子比例尺 (Quantile Scales)

量子比例尺定义域是连续的，值域是离散的。它适合处理数值对应到颜色的问题。

**d3.scaleQuantize()**

返回一个量子比例尺

**quantize.invertExtent(value)**

 返回值域所对应的定义域范围

## 分位比例尺 (Quantile Scales)

与量子比例尺有些类似，也是将连续的定义域区分成段，每一段对应到一个离散的值上。

**d3.scaleQuantile()**

返回一个分位比例尺

**quantile.quantiles**

返回所有的分位阈值

## 阈值比例尺 (Threshold Scales)

与分位刻度尺类似，不过它的值域可以是任意值。

**d3.scaleThreshold()**

```js
let color = d3.scaleThreshold()
  .domain([0, 1])
  .range(["red", "white", "green"])

color(-1)   // "red"
color(0)    // "white"
color(0.5)  // "white"
color(1)    // "green"
color(1000) // "green"
```

## 序数比例尺

定量比例尺定义域都是连续的，值域有连续也有离散的。
而序数比例尺则定义域和值域都是离散的。

**d3.scaleOrdinal([range])**

返回一个序数比例尺。range默认为空数组

**ordinal(value)**

根据一个定义域的值输出一个对应的值。如果值不在定义域内，则返回unknown

**ordinal.domain([domain])**

设置值域

**ordinal.range([range])**

设置定义域

**ordinal.unknown([value])**

设置未知值（默认为{name: 'implicit'}）

**Category Scales**

d3为序数比例尺提供了一系列的默认的颜色配套方案。

```js
let color = d3.scaleOrdinal(d3.schemeCategory10)
```

- d3.schemeCategory10
- d3.schemeCategory20
- d3.schemeCategory20b
- d3.schemeCategory20c

对应颜色效果如下:

![](https://raw.githubusercontent.com/d3/d3-scale/master/img/category10.png)

![](https://raw.githubusercontent.com/d3/d3-scale/master/img/category20.png)

![](https://raw.githubusercontent.com/d3/d3-scale/master/img/category20b.png)

![](https://raw.githubusercontent.com/d3/d3-scale/master/img/category20c.png)
