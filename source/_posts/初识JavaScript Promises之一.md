---
title: 初识JavaScript Promises之一
date: 2014-06-28
tags: JavaScript
---

JavaScript有很多槽点，嵌套回调怕是千夫所指。

很久之前，我一直使用async来处理JavaScript异步编程中的嵌套回调问题。当然我也大概的了解过一些其它旨在解决这些问题的类库，诸如EventProxy、Jscex、StepJS、thenjs。

当我第一次看到Promises规范的时候，我根本无法理解它所带来的好处。譬如每个初次学习Promises的人都见过如下的示例代码：
```javascript
//callbacks
function callback(err, value){
	if(err){
		// do something
		return;
	}
	//do other things with value
}
//Promises
promise.then(function(value){
	//do something with value
}, function(err){
	//do other things with error
})
```
很难相信上面的代码会让人对Promises刮目相看。不过正如[bluebird](https://github.com/petkaantonov/bluebird)作者Petka所说，上面的代码是
[“最不诚实的比较”](https://twitter.com/PetkaAntonov/status/475274392461910016)。所以我恳请你把类似的代码从你的记忆中擦出吧。

不妨让我们再回到async的讨论上。async的问题在于它不能优雅地应对需求的变化，一旦业务逻辑有较大的变化，代码结构会进行大幅度的调整，而Promises却能够轻松的应对这种变化。待时机适宜我会进行详细的比较，首先让我们开始快速地了解Promises。

------

## Promises是什么
Promises象征着一个异步操作的最终结果。Promises交互主要通过它的then方法，then方法接受一个回调函数，这个回调函数接受执行成功的返回值或执行失败的错误原因，错误原因一般是Error对象。**需要注意的是，then方法执行的返回值是一个Promise对象，而then方法接受的回调函数的返回值则可以是任意的JavaScript对象，包括Promises。基于这种机制，Promise对象的链式调用就起作用了。**
## Promises的状态
Promise对象有三种状态：pending（初始状态）、fulfilled（成功执行）、rejected（执行出错）。pending状态的Promise对象可以转换到其它两种状态。

------
 上面的文本不够形象，不妨上些代码来加深对Promises的认识。

注：由于主流的JavaScript环境（包括NodeJS）对Promises/A+标准的实现差强人意，我的示例均使用了第三方类库[bluebird](https://github.com/petkaantonov/bluebird)。

```javascript
var fs = require('fs')
var Promise = require('bluebird')
//改造fs.readFile为Promise版本
var readFileAsync = function(path){
	//返回一个Promise对象，初始状态pending
	return new Promise(function(fulfill, reject){
		fs.readFile(path,  'utf8', function(err, content){
			//由pending状态进入rejected状态
			if(err)return reject(err)
			//由pending状态进入fulfilled状态
			return fulfill(content)
		})
	})
}

//开始使用，调用其then方法，回调接受执行成功的返回值
readFileAsync('./promise-1.js').then(function(content){
	console.log(content)
})
```
看了上面的代码以后，是不是觉得Promises其实并不复杂呢。

OK，我们继续延续上面的代码，来简单比较一下传统回调和Promises的使用上的差别：
```javascript
/*
* 简单比较一下传统方式和Promises方式
* 需求：读取两个文件并打印内容
* */

 //callbacks
fs.readFile('./promise-1.js', 'utf8', function(err, content1){
	//嵌套一次
	console.log('#', content1)
	fs.readFile('./promise-1.js', 'utf8', function(err, content2){
 		//第二次嵌套
		console.log('##', content2)
	})
})

//Promises
readFileAsync('./promise-1.js').then(function(content1){
	console.log('#', content1)
	//这里返回一个Promise对象
	return readFileAsync('./promiscuitye-1.js')
}).then(function(content2){
	console.log('##', content2)
})
```
上面的代码都没有错误处理，这是一个后果很严重的坏习惯。不过今天我们的重点不在这里，而是分析上下两段代码的主要区别。

第一段代码是传统的嵌套回调，在第二次打印的时候已经使用了两次缩进，而Promises链式调用then方法成功地避免了一次缩进（嵌套），维持了代码结构的相对平坦。上面的代码略显简陋，如果再加上错误处理，Promises毫无疑问将会大放光彩，有兴趣请关注后续章节。

本章写到这里就结束了，相信大家已经对Promises的有了一个初步认识。规范文档往往很难理解，我没有过多的描述规范，因为我相信代码最能够解释一切。不过对规范文档有兴趣的可以自行阅读参考链接。

最后我想强调的一点就是：**Promises这种维持代码结构平坦的魔力在业务逻辑复杂多变的情况下是非常有用的**。

## 参考链接
> * [Promises/A+ 标准](https://github.com/promises-aplus/promises-spec)
> * [Bluebird](https://github.com/petkaantonov/bluebird)

------

未完待续(2014-06-28 00:59)
