---
title: 空格
date: 2016-09-09
tags: JavaScript
---

Unicode定义的空格符号如下：

[\u0020\u00A0\u1680\u180E\u2002-\u200D\u202F\u205F\u2060\u3000\uFEFF]

以下几种空格可以重点留意：
- \u0020为普通半角空格
- \u00A0为不换行的空格，对应HTML的&nbsp;(No-Break Space)
- \u200B为零宽空格（Zero Width Space）
- \uFEFF为零宽不换行空格（Zero Width No-Break Space）

其中\u2060为Unicode 3.2新增。

在移除字符串首尾空白时，我们看看TJ的[trim](https://www.npmjs.com/package/trim):

``` js
function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}
```

别看这个库如此简单，但是每天的下载量达到1W+。先不说其它方面的BUG，就正则来说问题就不少。
`\s`匹配一个空白字符，等价于：

[\f\n\r\t\v\u00A0\u0020\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]

可以看出很多第三方库在移除首尾空白时都没有考虑周全。
下面我们看看浏览器内置的trim又是怎样的？

示例代码：

``` js
var s = '\u0020\u00A0\u1680\u180E\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u200B\u200C\u200D\u202F\u205F\u2060\u3000\uFEFF'
for (var i = 0; i < s.length; i += 1) {
  if (s[i].trim().length > 0) {
    console.log('\\u' + s.charCodeAt(i).toString(16))
  }
}
```

输出结果如下：
- \u200b
- \u200c
- \u200d
- \u2060

结论很明朗：浏览器内置的trim也并非100%准确，所以我推荐在严格场景下面使用自定义的trim函数。

[查看在线示例](https://repl.it/DZhG/2)
## 参考链接
- [维基百科 - 空格](https://zh.wikipedia.org/wiki/%E7%A9%BA%E6%A0%BC)
