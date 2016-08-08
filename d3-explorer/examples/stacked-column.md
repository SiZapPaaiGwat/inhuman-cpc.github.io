# 在React的世界畅游d3 - 绘制堆积图

> 注意：阅读本系列文章需要一些React/SVG等方面的知识。

随着大数据相关技术的流行，数据分析在企业决策中的地位越来越突显，数据可视化在企业中的应用越来越多，当然对可视化效果的要求也越来越高。

`d3`作为前端界最负盛名的数据可视化工具，能满足常用的各种可视化需求，所以你一定不能忽略它。

本系列文章将使用`React + SVG + d3`一步步的实现官网的一些具有代表性的demo，带领大家在React的世界中畅游d3。

本文要实现的demo是[Stacked Bar Chart](https://bl.ocks.org/mbostock/3886208)。

## 配置代码

```js
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
```
