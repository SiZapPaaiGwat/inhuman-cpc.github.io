# 在React的世界畅游d3 - 绘制区域图

> 注意：阅读本系列文章需要一些React/SVG等方面的知识。

随着大数据相关技术的流行，数据分析在企业决策中的地位越来越突显，数据可视化在企业中的应用越来越多，当然对可视化效果的要求也越来越高。

`d3`作为前端界最负盛名的数据可视化工具，能满足常用的各种可视化需求，所以你一定不能忽略它。

本系列文章将使用`React + SVG + d3`一步步的实现官网的一些具有代表性的demo，带领大家在React的世界中畅游d3。

本文要实现的demo是[Area Chart](https://bl.ocks.org/mbostock/3883195)。

## 配置代码

```js
let margin = {top: 20, right: 20, bottom: 30, left: 50}
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

- d3.timeParse 从文本按指定格式解析时间，属于模块[d3-time-format](https://github.com/d3/d3-time-format)
- d3.scaleTime 创建时间比例尺，属于模块[d3-scale](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-scale.md)
- d3.scaleLinear 创建线性比例尺，属于模块[d3-scale](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-scale.md)
- d3.area 创建区域图，用于生成路径数据，属于模块[d3-shape](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-shape.md)
- d3.extent 对一组数据求值的范围，属于模块[d3-array](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-array.md)
- d3.max 对一组数值求最大值，属于模块[d3-array](https://github.com/simongfxu/simongfxu.github.com/blob/master/d3-explorer/api/d3-array.md)
- d3.tsv 请求数据，属于模块[d3-request](https://github.com/d3/d3-request)

```js
let parseDate = d3.timeParse("%d-%b-%y")
let xScale = d3.scaleTime().range([0, width])
let yScale = d3.scaleLinear().range([height, 0])
let area = d3.area().x(d => {
    return xScale(d.date)
  }).y0(height).y1(d => {
    return yScale(d.close)
  })
```

对于x轴属于时间段，需要求一个范围，我们使用`d3.extent`。
对于y轴需要从0开始根据最大值求一个范围,使用`d3.max`即可完成。

## 绘制坐标轴及刻度

这里我们已经在[line-with-missing-data](http://simongfxu.github.io/d3-explorer/examples/?line-with-missing-data)里讲述，这里的绘制过程几乎一模一样。

```js
renderXAxis() {
  let ticks = xScale.ticks()
  let tickNodes = ticks.map((val, i) => {
    return (
      <g key={val} transform={`translate(${xScale(val)}, 0)`}>
        <line y2={tickLength} x2="0" {...styles} />
        <text dy={tickLength * 1.5} y={tickLength * 1.5} x="0" style={{textAnchor:'middle'}}>
          {val.getFullYear()}
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

renderYAxis() {
  let ticks = yScale.ticks()
  let tickNodes = ticks.map((val, i) => {
    return (
      <g key={val} transform={`translate(0, ${yScale(val)})`}>
        <line y2="0" x2={-1 * tickLength} {...styles} />
        <text dy="0.4em" y="0" x={yAsixTickOffset} style={{textAnchor:'end'}}>
          {val}
        </text>
      </g>
    )
  })

  return (
    <g>
      <title>y轴及刻度</title>
      {tickNodes}
      <path d={`M${-1 * tickLength},${height}H0V0H${-1 * tickLength}`} {...styles} />
      <text transform="rotate(-90)" y="6" dy=".71em" style={{textAnchor: 'end'}}>Price ($)</text>
    </g>
  )
}
```

## 绘制区域线

绘制区域线的逻辑过程非常简单，使用path然后填充路径数据即可。
不过在填充之前我们需要做一些准备工作，因为我们的数据源全部是文本类型，而且存储在远端。
所以第一步我们需要请求获取数据源，然后做一些转换过程，最后再存储到React组件的state中。

```js
componentWillMount() {
  d3.tsv('../data/data.tsv', (err, data) => {
    data.forEach(function(d) {
      d.date = parseDate(d.date)
      d.close = +d.close
    })

    xScale.domain(d3.extent(data, (d) => {
      return d.date
    }))
    yScale.domain([0, d3.max(data, (d) => {
      return d.close
    })])

    areaPathData = area(data)
    this.setState({data})
  })
}
```

上面的代码在对数据源转换之后更新了x轴时间比例尺的定义域以及y轴的定义域。
然后使用area构造器对转换后的数据源求路径数据。

最后我们在`render`函数里根据state状态渲染即可。

```js
render() {
  let content = this.state.data.length ? (
    <g transform={`translate(${margin.left},${margin.top})`}>
      {this.renderArea()}
      {this.renderXAxis()}
      {this.renderYAxis()}
    </g>
  ) : (
    <text dy="1em" dx="1em">Loading...</text>
  )
  return (
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
      {content}
    </svg>
  )
}
```

至此，大功告成！
