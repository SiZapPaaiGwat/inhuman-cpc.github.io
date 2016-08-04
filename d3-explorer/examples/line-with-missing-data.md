# 在React的世界畅游d3 - 第一篇

> 注意：阅读本系列文章需要一些React/SVG等方面的知识。

随着大数据相关技术的流行，数据分析在企业决策中的地位越来越突显，数据可视化在企业中的应用越来越多，当然对可视化效果的要求也越来越高。

`d3`作为前端界最负盛名的数据可视化工具，能满足常用的各种可视化需求，所以你一定不能忽略它。

本系列文章将使用`React + SVG + d3`一步步的实现官网的一些具有代表性的demo，带领大家在React的世界中畅游d3。

本文要实现的demo是[Line with Missing Data](http://bl.ocks.org/mbostock/0533f44f2cfabecc5e3a)。

## 配置代码

```js
/**
 * 常量配置
 */
let margin = {top: 40, right: 40, bottom: 40, left: 40}
let width = 960 - margin.left - margin.right
let height = 500 - margin.top - margin.bottom
let tickLength = 6
let yAsixTickOffset = -9
let styles = {
  fill: 'none',
  stroke: '#000',
  shapeRendering: 'crispEdges'
}
```

## d3 API

本文主要使用到的API如下：

- d3.range 生成一组间隔一致的连续数据 [d3-array](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-array.md)
- d3.scaleLinear 创建定量线性比例尺 [d3-scale](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-scale.md)
- d3.line 创建一个新的线生成器 [d3-shape](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-shape.md)
- d3.format 生成格式化函数 [d3-format](https://github.com/d3/d3-format)

```js
let data = d3.range(40).map(function(i) {
  return i % 5 ? {x: i / 39, y: (Math.sin(i / 3) + 2) / 4} : null;
})
let xScale = d3.scaleLinear().range([0, width])
let yScale = d3.scaleLinear().range([height, 0])
let format = d3.format('.1f')
let line = d3.line()
  .defined(function(d) {return d})
  .x(function(d) {return xScale(d.x)})
  .y(function(d) {return yScale(d.y)})
// 生成path路径数据
let linePathData = line(data)
// 生成x访问函数，通过调用xAccessor({x, y})获取x
let xAccessor = line.x()
let yAccessor = line.y()
```

对于绘制坐标轴，比例尺必不可少。它能够根据一组定义域(`domain`)来输出一组值域(`range`)。
d3提供了多种比例尺，我们这里使用的是线性比例尺。更多比例尺介绍请看[d3-scale](../api/d3-scale.md)。

定义好比例尺之后我们可以使用如下方式获得每一个刻度的值。

```js
// 获取全部刻度
let ticks = xScale.ticks()
// 获取某个刻度对应的值
let rangeVal = xScale(0.5)
```

## 绘制坐标轴及刻度

首先我们要明确我们需要绘制的图形元素：对于x轴需要一条长的水平线（坐标轴），一条短垂直线以及对应的文本（刻度），
Y轴类似。

一个比较好的编程实践就是将相关的元素（刻度）全部放在g元素之下，这样方便对这组元素整体进行变换以及绘制样式设置。

**绘制x轴**

绘制x轴非常简单：移动到点(0,6)，画垂直线到原点，画水平线到(880,0)，画垂直线到(880,6)
注意：x轴需要对高度进行变换。

```js
<g transform={`translate(0, ${height})`}>
  <path d="M0,6V0H880V6" {...styles} />
</g>
```

**绘制刻度**

对于每一个刻度我们需要有一条刻度线以及对应的标签文本显示。
同样我们将他们包裹在g元素里，然后对其整体进行平移变换。这样不用对内部的每个元素都进行平移变换。
平移的值就是当前刻度对应的值，获取方式`xScale(tickValue)`。

```js
renderXAxis() {
  let ticks = xScale.ticks()
  let tickNodes = ticks.map((val, i) => {
    return (
      <g key={val} transform={`translate(${xScale(val)}, 0)`}>
        <line y2={tickLength} x2="0" {...styles} />
        <text dy={tickLength * 1.5} y={tickLength * 1.5} x="0" style={{textAnchor:'middle'}}>
          {format(val)}
        </text>
      </g>
    )
  })

  return (
    <g transform={`translate(0, ${height})`}>
      <title>x轴及刻度</title>
      {tickNodes}
      <path d={`M0,${tickLength}V0H${width}V${tickLength}`} {...styles} />
    </g>
  )
}
```

绘制Y轴原理类似，有一点不同的是刻度标签文本的偏移以及锚点位置。
对于X轴需要居中(`text-anchor: middle`)，对于Y轴则需要靠右对齐(`text-anchor: end`)。
另外纵向偏移量也需要适度调节。

```js
renderYAxis() {
  let ticks = yScale.ticks()
  let tickNodes = ticks.map((val, i) => {
    return (
      <g key={val} transform={`translate(0, ${yScale(val)})`}>
        <line y2="0" x2={-1 * tickLength} {...styles} />
        <text dy="0.4em" y="0" x={yAsixTickOffset} style={{textAnchor:'end'}}>
          {format(val)}
        </text>
      </g>
    )
  })

  return (
    <g>
      <title>y轴及刻度</title>
      {tickNodes}
      <path d={`M${-1 * tickLength},${height}H0V0H${-1 * tickLength}`} {...styles} />
    </g>
  )
}
```

## 绘制曲线

绘制曲线包含两部分：线条和每个刻度的y值。线条我们使用path绘制，这里只需要路径数据即可。
刻度的y值则使用一个小圆圈表示。

所以这里的关键在于获取x轴上的每个刻度在定义域（x轴）和值域(y轴)对应的值。

```js
let line = d3.line()
  .defined(function(d) {return d})
  .x(function(d) {return xScale(d.x)})
  .y(function(d) {return yScale(d.y)})
// 生成path路径数据
let linePathData = line(data)
// 生成x访问函数，通过调用xAccessor({x, y})获取x
let xAccessor = line.x()
let yAccessor = line.y()

// ...

renderChart() {
  return (
    <path d={linePathData} fill="none" stroke="steelblue" strokeWidth="1.5px" shapeRendering="optimizeSpeed" />
  )
}

renderCircles() {
  let circleItems = data.map(item => {
    if (!item) return
    let cx = xAccessor(item)
    let cy = yAccessor(item)
    return <circle key={cx} cx={cx} cy={cy} r="3.5" />
  })

  return (
    <g fill="white" stroke="steelblue" strokeWidth="1.5px">
      {circleItems}
    </g>
  )
}
```

至此，大功告成！
