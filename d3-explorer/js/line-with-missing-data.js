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

/**
 * d3相关的API使用
 */
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

class App extends React.Component {
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

  render() {
    return (
      <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {this.renderXAxis()}
          {this.renderYAxis()}
          {this.renderChart()}
          {this.renderCircles()}
        </g>
      </svg>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#wrapper'))
