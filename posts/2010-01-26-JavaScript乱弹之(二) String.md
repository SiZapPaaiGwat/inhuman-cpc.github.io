# JavaScript乱弹之(二) 

## 单引号与双引号

创建字符串的常用方法有以下两种。

> * 方法一：var str1="i love javascript";
> * 方法二：var str2='i love javascript';

单引号和双引号在JavaScript中的作用是等价的。但是一旦两者混用后就会引发一些麻烦，因此你需要妥善处理。

```js
var mystring="i love winslet's sister and nancy's sister";
```

这种情况你就必须使用转义字符，因为你需要输出单引号而单引号出现了不止一次。当单引号只出现一次时可以不使用转义字符。而当你仅希望将单引号之间的对象当作字符串处理时就不要使用转义字符。

## 字符串对象与字符串值

至此，我们需要区分字符串对象和字符串的值。通常来说我们都是只得字符串值。一个字符串对象是这样的：

```js
var strobject=new String("i love javascript");
```

测试一下你会发现strobject的数据类型是Object而不是String,但是他却继承了String所有的属性和方法。

## 连接字符串
连接较长的字符串时，你需要特别注意代码中的换行。JavaScript解释器的一个内置特性--在代码的逻辑终点加入分号，所以不能简单的使用回车换行，而应该在该行的最末尾加入“+”。

### 错误的做法：

```js
var strA="what i love is csharp ,javascript ,java,php
And vb.net";
```

### 正确的做法：

```js
var strA="what i love is csharp ,javascript ,java,php"+
"And vb.net";
```

在合适的地方合理的使用+和;可以减少很多JavaScript代码发生的意外错误。

## 提高字符串处理的性能
以前我一致认为字符串这么简单的对象，不管是C#还是JavaScript处理几万个字符的简单累加应该是不需要什么时间的。但是后来发现我错了，当数量超过2万以上时根据机器的性能需要3-15秒的时间。令人诧异吧！

C#中可以使用StringBuilder来提高字符串处理的性能，在JavaScript中我们有什么呢？Array！下面的例子一目了然。

```js
var Txt=new Array();
 Txt.push("<tr>");
 Txt.push("<td>");
 Txt.push("</td>");
 Txt.push("</tr>");
document.getElementById("tbody").innerHTML=Txt.join("");
Txt=null;
```
这个join方法就是在字符串之间加入一个字符，本例是一个空字符，注意不是空白字符" "。Join方法和绝大多数的字符串处理的方法（如indexOf、toUpperCase。即使是replece也不例外）一样并不会改变原字符串（数组）的内容。最后一句让浏览器回收降低内存消耗。

## 检验字符串的相等
JavaScript的两种等号操作符：==和===。==完全向后兼容，当两边类型不同时会执行类型转换。例如下面

两个对象

```js
var obj=new String("123"); 
var str="123";
```

很明显obj==str将返回true，而===则是严格等号操作不会执行类型转换。类似的可以参见上一节的undefined和null的比较。

## Unicode值和字符的互相转换
对于字符串值和字符串对象，两者是不同的。前者使用charCodeAt(index)后者使用String.fromCharCode(index);

另外不要简单的认为Unicode包含了全世界许多语言的文字和字符，就随意的断定知道字符的Unicode值就可以在警告框、文本框、或渲染页面中显示其他语言的特性字符，除非是浏览器和操作系统包含了这些语言。所以你经常在一些大型中文论坛发现很多留学生用英文回帖，其实不是他们不会中文，只是别人的系统和浏览器没有安装中文字体。

## URL字符串的编码和解码
常用的方法有escape和unescape、encodeURI和decodeURL、encodeURIComponent和decodeURIComponent，前者对应编码后者对应解码。

编码时普通的字母和数字一般都不会被转换，中文字符以及其他的特殊符号都能被转换。

注意：IE浏览器@不能通过escape方法转换。

另外Mozilla的浏览器独有的atob（）和btoa（）方法将普通字符串在Base64字符串中相互转换。