let margin = {top: 40, right: 40, bottom: 40, left: 40}
let width = 960 - margin.left - margin.right
let height = 500 - margin.top - margin.bottom

let data = d3.range(40).map(function(i) {
  return i % 5 ? {x: i / 39, y: (Math.sin(i / 3) + 2) / 4} : null;
})

var x = d3.scaleLinear().range([0, width])
var y = d3.scaleLinear().range([height, 0])

var linePathData = d3.line()
  .defined(function(d) {return d})
  .x(function(d) {return x(d.x)})
  .y(function(d) {return y(d.y)})

class App extends React.Component {
  renderXAxis() {
    return (
      <g className="axis axis--x" transform={`translate(0, ${height})`}>
      </g>
    )
  }

  renderYAxis() {
    return (
      <g className="axis axis--y">
      </g>
    )
  }

  renderLine() {
    return <path className="line" d={linePathData} />
  }

  renderPoints() {
    return (
      <g></g>
    )
  }

  render() {
    return (
      <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {this.renderXAxis()}
          {this.renderYAxis()}
          {this.renderLine()}
          {this.renderPoints()}
        </g>
      </svg>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#wrapper'))
