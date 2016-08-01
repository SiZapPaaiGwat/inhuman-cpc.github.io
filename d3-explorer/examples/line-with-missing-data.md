# 在React的世界畅游d3 - 第一篇：绘制坐标轴

d3是一个JavaScript的数据可视化的类库，如果你还没有听说过请自行脑补。

本文系列计划通过一步步实现官网的多个DEMO带领大家在React的世界中畅游d3，第一个要实现的DEMO是[Line with Missing Data](http://bl.ocks.org/mbostock/0533f44f2cfabecc5e3a)。

本系列必备的基础知识包含：

- React
- d3
- SVG

## 配置代码

```js
/**
 * 常量配置
 */
let margin = {top: 40, right: 40, bottom: 40, left: 40}
let width = 960 - margin.left - margin.right
let height = 500 - margin.top - margin.bottom
// 刻度长度
let tickLength = 6
// y轴刻度偏移量
let yAsixTickOffset = -9
// 绘制元素的一些通用样式
let styles = {
  fill: 'none',
  stroke: '#000',
  shapeRendering: 'crispEdges'
}
```

## d3相关逻辑

**涉及到的API**

- d3.range 生成一组间隔一致的连续数据 [d3-array](../d3-array.md)
- d3.scaleLinear 创建定量线性比例尺 [d3-scale](../d3-scale.md)
- d3.line 创建一个新的线生成器 [d3-shape](../d3-shape.md)
- d3.format 生成格式化函数 [d3-format](https://github.com/d3/d3-format)

```js
// 使用正弦函数生成数据源
let data = d3.range(40).map(function(i) {
  return i % 5 ? {x: i / 39, y: (Math.sin(i / 3) + 2) / 4} : null
})
// x轴比例尺
let xScale = d3.scaleLinear().range([0, width])
// y轴比例尺
let yScale = d3.scaleLinear().range([height, 0])
// 格式化函数
let format = d3.format('.1f')
// 数据源处理函数，过滤未定义的数据以及设置x/y访问函数
let linePathData = d3.line()
  .defined(function(d) {return d})
  .x(function(d) {return x(d.x)})
  .y(function(d) {return y(d.y)})
```

这里需要重点强调下比例尺，因为它在绘制图形时非常重要。d3提供了多种比例尺，我们这里使用的是线性比例尺。

定义好比例尺之后我们可以使用如下方式获得每一个刻度的值。

```js
// 获取全部刻度
let ticks = xScale.ticks()
// 获取某个刻度对应的值
let rangeVal = xScale(0.5)
```

## 绘制坐标轴及刻度

一个比较好的编程实践就是将相关的元素全部放在g元素之下，这样方便对这组元素整体进行变换以及绘制样式设置。

```js
<g transform={`translate(0, ${height})`}>
  ...
</g>
```

注意：X轴需要对高度进行变换。

绘制x轴非常简单（移动到0,6，画连接到原点的垂直线，画横线到880,0，画垂直先到880,6）

```js
<g transform={`translate(0, ${height})`}>
  <path d="M0,6V0H880V6" {...styles} />
</g>
```

**绘制刻度**

对于每一个刻度我们需要有一条刻度线以及对应的标签显示。
同样我们将他们包裹在g元素里，然后对其整体进行平移变换。这样不用对内部的每个元素都进行平移变换。
平移的值就是当前刻度对应的值，获取方式`xScale(tickValue)`。

```js
renderXAxis() {
  let ticks = xScale.ticks()
  let tickNodes = ticks.map((val, i) => {
    return (
      <g key={val} transform={`translate(${xScale(val)}, 0)`}>
        <line y2={tickLength} x2="0" {...styles} />
        <text dy=".71em" y="9" x="0" style={{textAnchor:'middle'}}>
          {format(val)}
        </text>
      </g>
    )
  })

  return (
    <g transform={`translate(0, ${height})`}>
      <title>x轴及刻度</title>
      {tickNodes}
      <path d="M0,6V0H880V6" {...styles} />
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
        <line y2="0" x2="-6" {...styles} />
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
      <path d="M-6,420H0V0H-6" {...styles} />
    </g>
  )
}
```

至此，我们的坐标轴和刻度已经绘制完成。
