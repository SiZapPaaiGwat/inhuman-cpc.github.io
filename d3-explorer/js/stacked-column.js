let margin = {top: 20, right: 20, bottom: 30, left: 40}
let width = 960 - margin.left - margin.right
let height = 500 - margin.top - margin.bottom
let tickLength = 6
let yAsixTickOffset = -9
let styles = {
  fill: 'none',
  stroke: '#000',
  shapeRendering: 'crispEdges'
}

let format = (val) => {
  val = d3.format('.3s')(val)
  if (val.indexOf('.') > -1) {
    val = val.replace(/\.\d+/g, '')
  }
  return val
}
let xScale =  d3.scaleBand().rangeRound([0, width]).padding(0.1).align(0.1)
let yScale = d3.scaleLinear().rangeRound([height, 0])
let zScale = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
let stack = d3.stack()

function type(d, i, columns) {
  i= 1
  let t = 0
  for (; i < columns.length; ++i) {
    t += d[columns[i]] = +d[columns[i]]
  }
  d.total = t
  return d
}

function center(scale) {
  var offset = scale.bandwidth() / 2
  if (scale.round())  {
    offset = Math.round(offset)
  }
  return function(d) {
    return scale(d) + offset
  }
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      data: []
    }
  }

  componentWillMount() {
    d3.csv('../data/stacked-column.csv', type, (err, data) => {
      data.sort((a, b) => {
        return b.total - a.total
      })

      xScale.domain(data.map(function(d) { return d.State; }))
      yScale.domain([0, d3.max(data, function(d) { return d.total; })]).nice()
      zScale.domain(data.columns.slice(1))

      this.setState({
        data
      })
    })
  }

  renderSeries() {
    let stackList = stack.keys(this.state.data.columns.slice(1))(this.state.data)
    return stackList.map(cols => {
      let rectList = cols.map(d => {
        let y = yScale(d[1])
        let h = yScale(d[0]) - y
        return <rect x={xScale(d.data.State)} y={y} width={xScale.bandwidth()} height={h} />
      })
      return (
        <g fill={zScale(cols.key)}>
          {rectList}
        </g>
      )
    })
  }

  renderXAxis() {
    let ticks = xScale.domain()
    let tickNodes = ticks.map((val, i) => {
      let position = center(xScale.copy())
      return (
        <g key={val} transform={`translate(${position(val)}, 0)`}>
          <line y2={tickLength} x2="0" stroke="#000" />
          <text dy={tickLength * 1.5} y={tickLength * 1.5} x="0" fill="#000">
            {val}
          </text>
        </g>
      )
    })

    return (
      <g transform={`translate(0, ${height})`} fill="none" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
        <title>x轴及刻度</title>
        {tickNodes}
        <path d={`M0,${tickLength}V0H${width}V${tickLength}`} {...styles} />
      </g>
    )
  }

  renderYAxis() {
    let ticks = yScale.ticks(10)
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
        <text y="6" dy=".71em" x="2">Population</text>
      </g>
    )
  }

  render() {
    let content = this.state.data.length ? (
      <g transform={`translate(${margin.left},${margin.top})`}>
        {this.renderSeries()}
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
