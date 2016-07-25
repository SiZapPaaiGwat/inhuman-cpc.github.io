# SVG学习笔记

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

## 参考资源

- [可縮放向量圖形 - 维基百科](https://zh.wikipedia.org/wiki/%E5%8F%AF%E7%B8%AE%E6%94%BE%E5%90%91%E9%87%8F%E5%9C%96%E5%BD%A2)
- [Using SVG - CSS Tricks](https://css-tricks.com/using-svg/)
- [SVG - MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [SVG Essentials](https://book.douban.com/subject/26640057/)
