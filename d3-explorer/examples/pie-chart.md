# 在React的世界畅游d3 - 绘制饼图

> 注意：阅读本系列文章需要一些React/SVG等方面的知识。

随着大数据相关技术的流行，数据分析在企业决策中的地位越来越突显，数据可视化在企业中的应用越来越多，当然对可视化效果的要求也越来越高。

`d3`作为前端界最负盛名的数据可视化工具，能满足常用的各种可视化需求，所以你一定不能忽略它。

本系列文章将使用`React + SVG + d3`一步步的实现官网的一些具有代表性的demo，带领大家在React的世界中畅游d3。

本文要实现的demo是[Canvas Pie](http://bl.ocks.org/mbostock/0533f44f2cfabecc5e3a)。

## 配置代码

```js
/**
 * 常量配置
 */
let width = 960
let height = 500
let radius = Math.min(width, height) / 2
// 数据源
let data = [
  {age: '<5', population: 2704659},
  {age: '5-13', population: 4499890},
  {age: '14-17', population: 2159981},
  {age: '18-24', population: 3853788},
  {age: '25-44', population: 14106543},
  {age: '45-64', population: 8819342},
  {age: '≥65', population: 612463}
]
```

## d3 API

本文主要使用到的API如下：

- d3.scaleOrdinal 创建序数比例尺 [d3-scale](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-scale.md)
- d3.pie 创建饼图 [d3-shape](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-shape.md)
- d3.arc 创建弧形 [d3-shape](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-shape.md)

```js
/**
 * d3 api
 */
let color = d3.scaleOrdinal().domain(data.map(item => {
  return item.age
})).range([
  '#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'
])
// sort(null) 表示不对数据源进行排序。默认会使用内部的降序排列
let pie = d3.pie().sort(null).value(d => {
  return d.population
})
let arc = d3.arc().outerRadius(radius - 10).innerRadius(0)
let labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40)
```

 color是一个序数比例尺，定义域的每个元素按索引与值域的每个颜色对应。

 pie是一个饼图构造器，传入数据源即可生成饼图相关的数据信息。

```js
let arcs = pie(data)
// return
/**
[
  {
    "data":{"age":"<5","population":2704659},
    "index":0,
    "value":2704659,
    "startAngle":0,
    "endAngle":0.46233446988176324,
    "padAngle":0
  },{"data":{"age":"5-13","population":4499890},"index":1,"value":4499890,"startAngle":0.46233446988176324,"endAngle":1.2315457670087755,"padAngle":0},{"data":{"age":"14-17","population":2159981},"index":2,"value":2159981,"startAngle":1.2315457670087755,"endAngle":1.6007729674024964,"padAngle":0},{"data":{"age":"18-24","population":3853788},"index":3,"value":3853788,"startAngle":1.6007729674024964,"endAngle":2.2595395742156663,"padAngle":0},{"data":{"age":"25-44","population":14106543},"index":4,"value":14106543,"startAngle":2.2595395742156663,"endAngle":4.670912349774174,"padAngle":0},{"data":{"age":"45-64","population":8819342},"index":5,"value":8819342,"startAngle":4.670912349774174,"endAngle":6.178490868277234,"padAngle":0},{"data":{"age":"≥65","population":612463},"index":6,"value":612463,"startAngle":6.178490868277234,"endAngle":6.283185307179585,"padAngle":0}]
*/
arcs.forEach(arc => {
  // 获取饼图每一块对应的颜色
  color(arc)
})
```

`d3.arc`用于生成圆形或环形图。第一个arc用于生成饼图的每一块扇形区域的路径数据。第二个labelArc用于定位数据项标签文本。

```js
let arcs = pie(data)
arcs.forEach(item => {
  let pathData = arc(item)
  // 返回扇形区域的中心点（不是几何意义上的中心点）
  // = (startAngle + endAngle) / 2 , (innerRadius + outerRadius) / 2
  let translate = labelArc.centroid(item)
})
```

> 对于d3.arc生成的图形，圆心坐标始终是(0,0)。因此在svg绘制的时候需要进行坐标变换，否则计算出来的数据无法准确定位

```js
renderPie() {
  let arcList = pie(data).map(item => {
    return (
      <g title={item.data.population}>
        <path
          shapeRendering="optimizeSpeed"
          stroke="#FFF"
          d={arc(item)}
          fill={color(item.data.age)}
        />
        <text
          transform={`translate(${labelArc.centroid(item)})`}
          style={{font: '10px sans-serif', textAnchor: 'middle'}}
        >
          {item.data.age}
        </text>
      </g>
    )
  })

  return (
    <g transform={`translate(${width / 2}, ${height / 2})`}>
      {arcList}
    </g>
  )
}

render() {
  return (
    <svg width={width} height={height}>
      {this.renderPie()}
    </svg>
  )
}
```
