---
title: 使用SlimerJS将网页输出为PDF
date: 2016-06-29
tags: SlimerJS
---

本文主要介绍本人在项目实践中通过`SlimerJS`将网页输出为PDF文档的过程，生成的PDF文档中的文本是矢量的，可以选择复制。
虽然网上也有一些类似的分享，但是并没有将整个过程中的可能遇到的坑以及在Web开发中的一些技术细节讲述的比较清楚。
## 软件清单：
- xvfb
- gtk3
- cups
- firefox
- slimerjs

本文使用的操作系统版本为CentOS 7.2。
## 安装xvfb

关于xvfb的介绍可以查看[wiki](https://en.wikipedia.org/wiki/Xvfb)，简单点说它就是用于处理程序中与图形化相关的功能，但是它不会在屏幕上展示任何图形输出。
安装以后可以使用**xvfb-run**命令来运行**headless slimerjs.**

``` html
yum install xorg-x11-server-Xvfb
```
## 安装Firefox

SlimerJS依赖于Firefox，目前支持的版本号介于38~ 46，其它版本官方无法保证测试结果。
所以不推荐安装大于46或者小于38的版本。

``` html
wget https://ftp.mozilla.org/pub/firefox/releases/46.0.1/linux-x86_64-EME-free/zh-CN/firefox-46.0.1.tar.bz2
tar xjvf firefox-46.0.1.tar.bz2
```

注意这里我们下载Firefox的版本号为64的[EME](https://wiki.mozilla.org/Media/EME)版本，普通版本在渲染复杂网页时可能会出现莫名的引擎级别错误。
## 安装GTK3

由于Firefox 46[依赖](https://www.mozilla.org/en-US/firefox/46.0/system-requirements/)于GTK3，所以这里我们需要安装GTK3。
另外如果你的操作系统版本为CentOS 6.x，那么我推荐你[放弃安装GTK3](http://itvision.altervista.org/compiling-and-installing-gtk3-in-centos6.html)，而是直接升级系统。

``` html
yum install gtk3-devel
```
## 安装CUPS

[CUPS](https://www.cups.org/)是由苹果开发的通用Unix打印系统，如果没有安装CUPS，SlimerJS将网页渲染为PDF的时候将会[挂起](https://docs.slimerjs.org/current/faq.html#on-linux-pdf-rendering-hangs-slimerjs)。

``` html
yum install cups
```
## 安装SlimerJS

``` html
wget http://download.slimerjs.org/releases/0.10.0/slimerjs-0.10.0.zip
unzip slimerjs-0.10.0.zip
```
## 设置环境变量

``` html
// 这里设置为firefox文件夹下的的firefox可执行文件的路径
export SLIMERJSLAUNCHER=PATH_TO_FIREFOX
```
## 开始执行

``` html
cd PATH_TO_SLIMERJS
xvfb-run ./slimerjs SCRIPT_PATH HTTP_PAGE_URL OUTPUT_FILENAME
```

另外如果执行没有正常运行，可以加上—debug参数

``` html
xvfb-run ./slimerjs --debug test.js http://www.qq.com/ test.pdf
```
## 参考代码

``` javascript
var page = require('webpage').create()
var system = require('system')

if (system.args.length !== 3) {
  console.log('Arguments error: xvfb-run ./slimerjs SCRIPT_PATH HTTP_PAGE_URL OUTPUT_FILENAME')
  slimer.exit()
} else {
  var url = system.args[1]
  var renderPath = system.args[2]

  console.log('Page url is ' + url)
  console.log('Output path is ' + renderPath)

  page.paperSize = {
    // magic number in my project
    width: '1500px',
    height: '1038px',
    shrinkToFit: true,
    printBGColors: true,
    printBGImages: true
  }

  page.onLoadFinished = function() {
    console.log('Finish loading page')
    // 有些时候分页不理想，需要删除一些节点
    page.evaluate(function() {
      var nodes = document.querySelectorAll('.bottom-line')
      for(var i = 0; i< nodes.length; i += 1) {
        nodes[i].parentNode.removeChild(nodes[i])
      }
    })
    console.log('Start rendering')
    page.render(renderPath)
    console.log('Finish rendering')
    slimer.exit()
  }

  console.log('Opening page now ...')
  page.open(url)
}
```
## 字体

由于服务部署在Linux服务器上，网页渲染使用的字体与Windows和macOS区别还是很大的，比如Windows的微软雅黑在Linux是无法使用的。
另外在安装字体上也有两种选择，第一是直接安装在服务器上，第二是作为Web Fonts从网页中引入。
## Flex布局

早先我们尝试使用PhantomJS来完成此工作，虽然网上有说2.x支持Flex布局，但是我们的实践结果是不支持。SlimerJS在Flex布局上支持的很好，无需任何额外工作。
## Canvas绘制

我们的网页使用了ECharts来进行图表绘制，ECharts底层使用了canvas来绘制图表。
PhantomJS输出的PDF在这方面支持很差，Stacked Column中莫名的出现很多空白间隙。SlimerJS的表现要好得多，不过有些淡虚线比实际要粗一些，色彩也深一些。
## 文档分页

如果希望输出的PDF能够支持分页输出（方便分页打印），需要设置paperSize的Height来确定每页pdf的高度。
不过这里也是有坑的，每页PDF高度会有几个像素的差距，导致会多出一个空白页。
## CSS适配

渲染PDF的时候，浏览器进入打印模式，如果你没有专门适配样式，输出效果会很差。很多元素的背景颜色/文本颜色/背景图片不会展示出来。
对于PhantomJS，网上有讨论说需要加上如下样式（我本人并未实践过此方案）：

``` css
@media print {
  body {
     /*https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-print-color-adjust*/
     -webkit-print-color-adjust: exact;
  }
}
```

对于SlimerJS，虽然paperSize存在相关设置（printBGColors/printBGImages），但是文本颜色似乎无法设置。所以我推荐在编写CSS的时候注意如下细节：
- 将所有背景图片转换为Base64字符串直接在css中引入（幸好有webpack）
- 所有设置元素文本颜色和背景颜色的样式需要兼容打印模式
- 文本颜色相关的设置不支持inherited，这点尤其注意

样例代码如下：

``` css
.someClassName {
  background-color:red;
  color: #FFF;
}

@media print {
  .someClassName {
    background-color:red !important;
    color: #FFF !important;
  }
}
```
## 最后的忠告

_不要寄希望于输出的PDF与网页中展示效果100%一致，几乎不可能（尤其是网页内容相对比较复杂的时候），最终效果或多或少都会有些瑕疵。_
