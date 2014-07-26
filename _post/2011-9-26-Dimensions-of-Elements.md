---
layout: page
title: Dimensions of Elements
category: javascript
tags: [dimension, JavaScript, jQuery]
tagline: 元素的各种尺寸
---

**在使用JavaScript脚本获取 `元素的尺寸` 时，有几个属性你需要弄清楚，不然会很棘手。以往我都是对这些属性死记硬背，忘记了就查手册。看完本文我相信这种情况就不会再发生了.

## 元素占据的物理空间的尺寸

如果你需要获得元素占据的物理空间，那么使用 `ffsetHeight` 和 `offsetWidth` 。
自然而然此物理空间必然包含的有：`padding` 、`滚动条` 、`border`。这两个属性与 `getBoundingClientRect()`的height和width属性是一致的。

为了帮助理解请看下图：

![Alt text](https://developer.mozilla.org/@api/deki/files/186/=Dimensions-offset.png)

## 元素内部内容的可视区域的尺寸

可视区域包含padding，但是不包含border、滚动条。此时请使用 `clientHeight` 和 `clientWidth` 。

为了帮助理解请看下图：

![Alt text](https://developer.mozilla.org/@api/deki/files/185/=Dimensions-client.png)

## 元素内部内容的全部尺寸

如果你要获取元素内容的真正大小，当然也包含那些不可见的内容，此时你需要使用 `scrollHeight` / `scrollWidth` 。

例如一张600*400的图片被包含在一个300*300的可滚动的容器元素内，那么scrollWidth将返回600，而scrollHeight将返回400

## 获取元素的真实尺寸

大部分场景，我们并不关心元素的全部内容的尺寸（window/document/body元素除外），最常用的恐怕还是获取元素占据的物理空间(offsetHeight/offsetWidth)。

比如对某段文字设置自定义的tooltip，这个时候需要获取目标元素的高度然后对tooltip进行定位。

不论是clientHeight还是offsetHeight它们都包含了padding，假设这段文字包含了100px的padding，这个tooltip的位置显然会极其的不准确。

因此获取元素的高度通常是需要去掉padding。

由于元素的style属性只能获取到内联样式的width/height，所以在IE中需要使用 `el.currentStyle.height/width`，
而标准浏览器中使用 `window.getComputedStyle(el,null).width/height`。
下面是我整理的园友Snandy的一个用户获取元素真实高度和宽度的方法 :

    function getStyle(el) {
        if(window.getComputedStyle) {
            return window.getComputedStyle(el, null);
        }else{
            return el.currentStyle;
        }
    }
    function getWH(el, name) {
        var val = name === "width" ? el.offsetWidth : el.offsetHeight,
            which = name === "width" ? ['Left', 'Right'] : ['Top', 'Bottom'];
        // display is none
        if(val === 0) {
            return 0;
        }
        var style = getStyle(el);
        for(var i = 0, a; a = which[i++];) {
            val -= parseFloat( style["border" + a + "Width"]) || 0;
            val -= parseFloat( style["padding" + a ] ) || 0;
        }
        return val;
     } 

*** 

## jQuery与元素尺寸相关的方法

### jQuery.height()/jQuery.width()

返回一个整数，为匹配的jQuery对象集合中第一个元素的高度值。
注意此结果不关心盒式模型，不包含元素的padding。此方法等价于getWH(el,'height/width')
这个方法同样能计算出window和document的高度。

### jQuery.innerHeight()/jQuery.innerWidth()

对比jQuery.height() /jQuery.width() 此结果包含padding，但是不包含border。
当元素el未设置border时，此方法等价于el.offsetHeight/offsetWidth

### jQuery.outerHeight()/jQuery.outerWidth()

对比jQuery.height() /jQuery.width() 此结果包含padding和border，默认不包含margin。
当元素未指定margin时，此方法等价于el.offsetHeight/offsetWidth
可以传入一个bool变量来指定是否包含margin。

注意：
由于获取普通元素的全部内容的尺寸意义不大（某些元素除外如window、document、iframe等），
所以jQuery的这三个方法都未包含不可见区域。

***

### 参考阅读

*	[各情景下元素宽高的获取 by Snandy](http://www.cnblogs.com/snandy/archive/2011/09/06/2167440.html)
*	[Determining the dimensions of elements](https://developer.mozilla.org/en/Determining_the_dimensions_of_elements)
*	[Measuring Element Dimension and Location with CSSOM in Internet Explorer 9](http://msdn.microsoft.com/en-us/library/ms530302(VS.85).aspx)


