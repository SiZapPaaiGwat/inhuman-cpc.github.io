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

let parseDate = d3.timeParse("%d-%b-%y")
let xScale = d3.scaleTime().range([0, width])
let yScale = d3.scaleLinear().range([height, 0])
let area = d3.area().x(d => {
    return xScale(d.date)
  }).y0(height).y1(d => {
    return yScale(d.close)
  })
let areaPathData

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      data: []
    }
  }

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

  renderArea() {
    return <path d={areaPathData} shapeRendering="optimizeSpeed" fill="steelblue" />
  }

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
}

ReactDOM.render(<App />, document.querySelector('#wrapper'))
