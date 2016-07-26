# SVG简明笔记

## 概述

SVG全称Scalable Vector Graphics，译名可缩放矢量图形，用于描述二维矢量图形的XML标记语言。
SVG是一个W3C标准，能够与CSS、DOM等协同工作。

SVG推出于1999年，但是浏览器的实现进度却非常缓慢，直到2009年应用在Web上的SVG内容都不是非常多。
关键在于即使浏览器支持SVG，在当时的实现程度也不如竞争技术如`Canvas`和`Flash`。

当然SVG有它自身的有点比如，它实现了DOM接口，比Canvas使用起来要方便；
它也不需要安装浏览器插件，这一点比Flash要方便。

SVG2003年成为W3C推荐标准，最接近的完整版本是SVG1.1。SVG1.1在2011年成为推荐标准。
SVG2.0正在[起草制定](https://svgwg.org/svg2-draft/)当中。

SVG还有其他子集实现，比如`SVG Basic`和`SVG Tiny`，前者是基本版主要支持掌上电脑等高端移动设备，
后者为简化版主要支持手机等低端移动设备。

## 特点

SVG支持矢量图形、栅格图像（JPG、PNG等）以及文本，提供的功能涵盖了嵌套转换、裁剪路径、Alpha通道、
滤镜效果、模板对象以及可扩展性。

**SVG的优点：**

- 图形文件可读，易于修改和编辑
- 与JavaScript充分融合
- 方便建立图像内容的文本索引
- 支持多种滤镜和效果
- 可以生成动态图片

缺点：

- 依赖于浏览器的实现程度
- 遵循XML语法的文本文件导致体积稍大（不过有`svgz`）

## 引入SVG

**作为图片引入**

```html
<img src="someSVGPic.svg" alt="svg" />
```

> 使用此种方式引入渲染逻辑（高度和宽度）会比普通的栅格图像更加复杂。主要体现在viewBox属性的使用

**作为CSS背景引入**

```css
.someStyle {
  background-image: url("someSVGPic.svg");
}
```

**使用iframe引入**

```html
<iframe src="someSVGPic.svg" frameborder="0"></iframe>
```

**作为object资源引入**

```html
<object type="image/svg+xml" data="kiwi.svg" class="logo">
  logo<!-- fallback image in CSS -->
</object>
```

**使用Data URI引入**

```html
<img src="data:image/svg+xml;base64,[data]">
```

**使用inline方式引入**

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <text x="125" y="125" dy="0.5em" text-anchor="middle">
    Hello, world!
  </text>
</svg>
```

> 如果你的HTML文档使用了HTML 5的文档声明（<!DOCTYPE	html>），那么`xmlns`属性可以忽略

> 默认情况，svg元素使用display: inline的展示方式，当然你可以使用CSS来更改svg的各种样式属性。

## 坐标定位

SVG使用的坐标系统和Canvas一样，以页面的左上角为(0,0)坐标点，坐标以像素为单位，x轴正方向是向右，y轴正方向是向下。

**Viewport**

svg根元素的width和height属性决定了整个svg画布的大小，**如果不指定单位默认实现像素px(svg子元素也是如此)**。当然你还可以指定如下的单位：

- em 相对大小,1em表示当前字体尺寸
- ex x的字体尺寸，通常是普通字体的一半
- pt Points 1磅，等于1/72英寸
- pc Picas 12活字，等于1/6英寸
- cm 厘米
- mm 毫米
- in 英寸

**viewBox**

viewBox指定画布上可以显示的区域，通过与svg元素自身的的width/height属性，能使svg具有图形伸缩的能力。
它接受四个数值由空格或者逗号分隔，分别表示能够显示的最小的X轴的值以及最小的Y轴值、宽度、高度。

```html
<svg width="200" height="200" viewBox="0 0 100 100">
</svg>
```

上面的代码在一个宽200px高200px的画布上指定呈现区域为(0,0)到(100,100)，因此等同于与将元素放大2倍。

支持此属性的标签元素如下：

- marker
- pattern
- view

**preserveAspectRatio**

有些时候viewBox的宽高比并不总是和画布的宽高比一致，这个时候就需要有一种策略来建立一个新的viewport。使用参数如下：

```html
preserveAspectRatio="[defer] <align> [<meetOrSlice>]"
```

`defer`是给image元素专用，其它元素会被忽略。
`align`由none或者x[Min|Mid|Max]Y[Min|Mid|Max]组成，
`meetOrSlice`由meet或者slice组成，默认为meet。

![](https://www.w3.org/TR/SVG11/images/coords/PreserveAspectRatio.svg)

[演示实例](http://oreillymedia.github.io/svg-essentials-examples/ch03/meet_slice_specifier.html)

[详细介绍见W3C](https://www.w3.org/TR/SVG11/coords.html#PreserveAspectRatioAttribute)

## 基本形状

```html
<svg width="200" height="250">

  <rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>
  <rect x="60" y="10" rx="10" ry="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>

  <circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>
  <ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" stroke-width="5"/>

  <line x1="10" x2="50" y1="110" y2="150" stroke="orange" fill="transparent" stroke-width="5"/>
  <polyline points="60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145"
      stroke="orange" fill="transparent" stroke-width="5"/>

  <polygon points="50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180"
      stroke="green" fill="transparent" stroke-width="5"/>

  <path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5"/>
</svg>
```

![](https://developer.mozilla.org/@api/deki/files/359/=Shapes.png)

所有的基本形状都可以由`path`来完成，在实际的编程开发中不太推荐直接使用这些基本形状。

## Path

path元素需要一个d属性（代表data），d属性里面由一系列的命令+参数组成：

- Moveto
- Lineto
- Curveto
- Arcto
- ClosePath

**Moveto**

命令：M/m，参数：x y，移动到指定坐标

> 小写的m使用相对距离，参考点为上一点个位置，以下类似。

**Lineto**

命令：L/l，参数：x y，在目标点之间画一条直线

命令：H/h，参数：x，在目标点之间画一条与x轴平行的直线

命令：V/v，参数：y，在目标点之间画一条与y轴平行的直线

**Arcto**

命令：A/a，参数：rx ry xAxisRotate LargeArcFlag SweepFlag x y，在目标点之间画一条椭圆弧曲线路径

> 由于给定x轴和y轴半径以及两个坐标点，总是有两个路径可以连接它们，所以画椭圆曲线需要额外的参数
>
> rx/ry分别代表x轴和y轴半径
>
> x和y代表终点坐标
>
> xAxisRotate为x轴旋转角度
>
> LargeArcFlag表示弧度是否大于180度，0为小角弧
>
> SweepFlag表示从起点到终点画弧是顺时针还是逆时针（0为逆时针）

![](https://developer.mozilla.org/@api/deki/files/345/=SVGArcs_Flags.png)

**Curveto**

命令：C/c，参数：x1 y1 x2 y2 x y，从当前点到(x, y)画一个三次贝塞尔曲线，使用(x1, y1)作为起始控制点，(x2, y2)作为结束控制点

![](https://developer.mozilla.org/@api/deki/files/159/=Cubic_Bezier_Curves.png)

命令：S/s，参数：x2 y2 x y，从当前点到(x, y)画一个三次贝塞尔曲线，使用(x2, y2)作为结束控制点，上一次的结束控制点的对称点作为起始控制点

![S/s](https://developer.mozilla.org/@api/deki/files/363/=ShortCut_Cubic_Bezier.png)

命令：Q/q，参数：x1 y1 x y，从当前点到(x, y)画一个二次贝塞尔曲线，使用(x1, y1)作为控制点

> 二次贝塞尔曲线只需要一个控制点

![](https://developer.mozilla.org/@api/deki/files/326/=Quadratic_Bezier.png)

命令：T/t，参数：x y，从当前点到(x, y)画一个二次贝塞尔曲线，类似于三次贝塞尔曲线的S命令，使用上一次的控制点的对称点

![](https://developer.mozilla.org/@api/deki/files/364/=Shortcut_Quadratic_Bezier.png)

**ClosePath**

命令：Z/z，闭合路径（不区分大小写）

> 用四条直线画一个矩形和使用闭合路径有哪些不一样？主要体现在当你使用了较宽的stroke-width或stroke-linecap、stroke-linejoin等效果 	

```html
<g style="stroke: gray;stroke-width: 8;fill: none;">
  <!-- rectangle 四条直线 -->
  <path d="M 10 10 L 40 10 L 40 30 L 10 30 L 10 10"/>
  <!-- rectangle 闭合 -->
  <path d="M 60 10 L 90 10 L 90 30 L 60 30 Z"/>
</g>
```

## Marker

marker是一个容器元素，它允许在特定的元素上(path/line/polyline/polygon)绘制各种箭头或者图形标记。

**专有属性**

- markerUnits [strokeWidth|userSpaceOnUse] 设置marker内的图形尺寸是否与外部图形的stroke-width相关
- refX
- refY
- markerWidth
- markerHeight
- orient 设置旋转的度数，auto表示与当前路径方向一致。

```html
<svg>
  <defs>
    <marker id="mCircle" markerWidth="10" markerHeight="10" refX="5" refY="5">
      <circle cx="5" cy="5" r="4" style="fill:    none;    stroke:    black;">
      </circle>
    </marker>
    <marker id="mArrow" markerWidth="6" markerHeight="10" refX="0" refY="4" orient="auto">
      <path d="M 0 0 4 4 0 8" style="fill: none; stroke: black;">
      </path>
    </marker>
    <marker id="mTriangle" markerWidth="5" markerHeight="10" refX="5" refY="5" orient="auto">
      <path d="M 0 0 5 5 0 10 Z" style="fill: black;">
      </path>
    </marker>
  </defs>
  <path d="M 10 20 100 20A 20 30 0 0 1 120 50L 120 110"
    style="marker-start: url(#mCircle);marker-mid: url(#mArrow);marker-end: url(#mTriangle);fill: none; stroke: black;">
  </path>
</svg>
```

[查看示例](http://codepen.io/simongfxu/pen/kXJKvV)

## 参考资源

- [可縮放向量圖形 - 维基百科](https://zh.wikipedia.org/wiki/%E5%8F%AF%E7%B8%AE%E6%94%BE%E5%90%91%E9%87%8F%E5%9C%96%E5%BD%A2)
- [Using SVG - CSS Tricks](https://css-tricks.com/using-svg/)
- [SVG - MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [SVG Essentials](https://book.douban.com/subject/26640057/)
