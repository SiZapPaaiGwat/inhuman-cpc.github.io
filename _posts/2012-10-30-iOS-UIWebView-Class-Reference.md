---
layout: page
title: A Cross Domain Practice
category: javascript ruby sinatra
tags: [iOS, JavaScript, HTML5]
tagline: iOS UIWebView Class Reference
---

{% include JB/setup %}

[原文地址](https://developer.apple.com/library/ios/#documentation/UIKit/Reference/UIWebView_Class/Reference/Reference.html)

##属性

###allowsInlineMediaPlayback

<strong style="color:red;">前端重点关注</strong>

是否允许页内播放视频，默认值NO，使用原生的全屏控制。

使用页面播放需要设置此属性为YES，并且video 元素要加上 `webkit-playsinline`属性。

###canGoBack

是否可以后退，只读属性

###canGoForward

是否可以前进，只读属性

###dataDetectorTypes

在webview被转换为可点击的URL内容的数据类型。

使用此属性可以指定譬如`http链接`，`Email地址`，`电话号码`等内容将自动转换为可点击的链接。当点击以后，webview寻找相应的应用程序来处理。

###delegate

委托，用于回调通知页面的加载状态，比如已经打开、打开完成或打开错误等。


###keyboardDisplayRequiresUserAction

<strong style="color:red;">前端重点关注</strong>

显示键盘是否一定需要用户动作，默认值为YES，也就是用户必须主动点击可输入的表单元素以后才会显示键盘。

设置为NO以后，页面可以通过JS脚本的`focus`事件显示键盘。

###loading

webview是否还在加载，只读属性

####mediaPlaybackAllowsAirPlay

<strong style="color:red;">前端重点关注</strong>

媒体播放是否允许`Air Play`???默认值为YES

###mediaPlaybackRequiresUserAction

<strong style="color:red;">前端重点关注</strong>

媒体播放是否需要用户动作主动触发，默认值为YES。也就是说默认情况无法自动播放音频和视频。

那么默认设置下是不是一定无法自动播放呢？StackOverflow上找到一个[方法](http://stackoverflow.com/questions/4259928/how-can-i-autoplay-media-in-ios-4-2-1-mobile-safari)解决此问题（没有测试）

```javascript
    var ifr = document.createElement("iframe");
    ifr.setAttribute('src', "http://mysite.com/myvideo.mp4");
    ifr.setAttribute('width', '1px');
    ifr.setAttribute('height', '1px');
    ifr.setAttribute('scrolling', 'no');
    ifr.style.border="0px";
    document.body.appendChild(ifr);
```

###request

webview当前请求的URL，只读属性

###scalesPageToFit

指定页面是否按比例缩放适应webview，并且用户可以更改缩放比例。默认值为NO，用户不能更改缩放比例。

###scrollView

webview关联的scroll view，只读属性

###suppressesIncrementalRendering

当页面完全加载到内存以后，webview是否禁止增量内容渲染，默认值为NO

iOS 6.0版本支持

##实例方法

###goBack

加载历史记录当前页之前的页面

###goForward

加载历史记录当前页之后的页面

###loadData:MIMEType:textEncodingName:baseURL

设置页面内容，MIMIE type，编码，URL

###loadHTMLString:baseURL:

设置页面内容

###loadRequest

根据指定的URL进行异步连接

###reload

重新载入当前页

###stopLoading

取消当前页的加载

###stringByEvaluatingJavaScriptFromString

<strong style="color:red;">前端重点关注</strong>

在页面加载完成以后运行JavaScript脚本，运行脚本有如下注意事项：

* 脚本运行不得超过10秒
* 将要执行的脚本内存分配不得超过10M

[这里](http://url.cn/7Vf4bx)有一个比较详细的教程可以参考