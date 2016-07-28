// http://bl.ocks.org/mbostock/0533f44f2cfabecc5e3a

/**
 * 常量配置
 */
let CONFIG = {
  width: 600, // 画布宽度
  height: 300 // 画布高度
}

let dataSource = d3.range(40).map(i => {
  return {x: i / 39,  y: (Math.sin(i / 3) + 2) / 4}
}).map(i => {
  return i && {
    x: CONFIG.width * i.x,
    y: CONFIG.height * (1 - i.y)
  }
})

let path = d3.line().x(d => {
  return d.x
}).y(d => {
  return d.y
})(dataSource)

class App extends React.Component {
  render() {
    return (
      <svg width={CONFIG.width} height={CONFIG.height}>
        <path d={path} fill="none" stroke="#666" stroke-width="2" />
      </svg>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#wrapper'))
