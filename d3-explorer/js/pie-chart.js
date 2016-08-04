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

/**
 * d3 api
 */
let color = d3.scaleOrdinal().range([
  '#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'
])
// sort(null) 表示不对数据源进行排序。默认会使用内部的降序排列
let pie = d3.pie().sort(null).value(d => {
  return d.population
})
let arc = d3.arc().outerRadius(radius - 10).innerRadius(0)
let labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40)

class App extends React.Component {
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
}

ReactDOM.render(<App />, document.querySelector('#wrapper'))
