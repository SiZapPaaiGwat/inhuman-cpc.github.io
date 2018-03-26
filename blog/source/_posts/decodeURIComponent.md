---
title: 捉虫记之decodeURIComponent
date: 2015-06-30
tags: JavaScript
---

DataEye游戏分析平台有个实时日志功能，用于展示接收来自游戏客户端SDK上报数据以及游戏开发商使用HTTP接口发送的数据。
## 第一版

数据库收到什么样的JSON数据就直接返回给前端展示，终于有一天客户反馈页面脚本报错。

一番调查，原来是数据库中存在特殊字符，于是要求后台全部url encode一次，前端decode就可以了。验证OK，于是测试发布。直到有一天用户反馈部分数据没有decode，还是类似%25XX的字符。
## 第二版

一番调查，原来是用户使用的是HTTP接口发送数据而不是SDK，所以部分数据自己encode了一次。然后服务器返回给前端页面的就是encode两次的数据。

不就encode两次的问题嘛，页面decode两次就可以了嘛！于是无脑地吧decodeURIComponent(str)全部替换成了decodeURIComponent(decodeURIComponent(str))，发现问题居然解决了，找了另外的客户数据测试了下，验证也OK，于是发布。直到有一天某个另外的客户反馈页面脚本报错。
## 第三版

一番调查，根据URI Malformed Error这个罪证google得知，原来是源字符串不是合法的URL编码的字符串。虽然提示已经相当的明确了，但由于JSON数据量不少，字段较多，而且有些地方只需要decode一次，有些地方又需要decode两次，定位问题还是花了一些时间。最后发现罪魁祸首居然是用户输入的内容`14%`。
## 解决方法

``` javascript
function safeDecodeURIComponent(str) {
    if (!str || typeof str !== 'string') return String(str)

    // encodeURIComponent不编码字符有71个：!， '，(，)，*，-，.，_，~，0-9，a-z，A-Z
    var twiceEncodedReg = /^(%\w{4,4}|[!'()*\-._~0-9a-z])+$/gi
    var encodedReg = /^(%\w{2,2}|[!'()*\-._~0-9a-z])+$/gi

    // 这里用try catch是因为即使正则匹配也有可能解码异常，异常或者不匹配时返回源字符串即可
    try {
        if (twiceEncodedReg.test(str)) return decodeURIComponent(decodeURIComponent(str))
        if (encodedReg.test(str)) return decodeURIComponent(str)
    } catch(e) {
    }

    return str
}
```
## 相关链接

> - [Comparing escape(), encodeURI(), and encodeURIComponent()](http://xkr.us/articles/javascript/encode-compare/)
> - [http://www.cnblogs.com/jhxk/articles/1634359.html](http://www.cnblogs.com/jhxk/articles/1634359.html)
## 最后的总结

基础知识不扎实导致无法深入剖析问题所在，解决方案自以为然也就不足为怪了。

----7-21更新----
## 后续

果然还是有后续！昨天突然一个客户又反馈有乱码，一番研究发现用户输入部分编码，部分未编码。上面的方法就不凑效了，于是花了几分钟做了如下改进：

``` js
function safeDecodeURIComponent(str) {
    var lastResult = str, current
    try {
        while((current = decodeURIComponent(lastResult)) != lastResult) {
            lastResult = current
        }
    } catch(e) {}

    return lastResult
}
```
