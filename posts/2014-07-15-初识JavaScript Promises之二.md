# 初始JavaScript Promises之二

------
上一篇我们初步学习了JavaScript Promises，本篇将介绍Promise如何优雅地进行错误处理以及提升操作**node.js风格**[^1]的异步方法的逼格，没错就是使用**promisify**[^2]。

## 异步编程中的错误处理

 人性的、理想的也正如很多编程语言中已经实现的错误处理方式应该是这样：
 
```javascript

try {
    var val = JSON.parse(fs.readFileSync("file.json"));
}catch(SyntaxError e) {//json语法错误
    console.error("不符合json格式");
}catch(Error e) {//其它类型错误
    console.error("无法读取文件")
}

```

很遗憾，JavaScript并不支持上述方式，于是“聪明的猴子”很可能写出下面的代码：

```javascript

try {
    //code
}catch(e) {
    if( e instanceof SyntaxError) {
        //handle
    }else {
      	//handle  
    }
}

```

相信没人会喜欢第二段代码，不过传统的JavaScript也只能帮你到这里了。

上面的代码是同步模式，异步模式中的错误处理又是如何呢？

```javascript

fs.readFile('file.json', 'utf8', function(err, data){
	if(err){
		console.error("无法读取文件")
	}else{
		try{
			var json = JSON.parese(data)
		}catch(e){
			console.error("不符合json格式");
		}
	}
})

```

友情提醒：在node.js中你应该尽量避免使用同步方法。

仔细比较第一段和第三段的代码的差异会发现，如此简单的代码竟然用了三次缩进！如果再加入其它异步操作，邂逅`callback hell`是必然的了。

------
## 使用Promise进行错误处理

假设fs.readFileAsync是fs.readFile的Promise版本，这意味着什么呢，不妨回忆一下：

> * fs.readFileAsync方法的返回结果是一个Promise对象
> * fs.readFileAsync方法的返回结果拥有一个then方法
> * fs.readFileAsync方法接受参数与fs.readFile一致，除了最后一个回调函数

返回Promise对象意味着，执行fs.readFileAsync并不会立即执行异步操作，而是通过调用其then方法来执行，then方法接受的回调函数用于处理正确返回结果。所以使用fs.readFileAsync的使用方式如下：

```javascript

//Promise版本
fs.readFileAsync('file.json', 'utf8').then(function(data){
	console.log(data)
})

```

OK，让我们继续错误处理这个话题。由于[Promises/A+](http://promisesaplus.com/)标准对Promise对象只规定了唯一的then方法，没有专门针对catch或者error的方法，我们将继续使用[bluebird](https://github.com/petkaantonov/bluebird)。

```javascript

// 带错误处理的Promise版本
fs.readFileAsync('file.json', 'utf8').then(function(data){
	console.log(data)
}).catch(SyntaxError, function(e){
	//code here
}).catch(function(e){
	//code here
})

```
上面的代码没有嵌套回调，和本文开始的第一段代码的编写模式也基本一致。

## 神奇的Promisify

注：

下面我们看如何对fs.readFileAsync方法进行promisify，依然是使用bluebird。

```javascript

var Promise = require('bluebird')
fs.readFileAsync = Promise.promisify(fs.readFie, fs)

```

怎么样，就是如此简单！对于bluebird它还有一个更强大的方法，那就是promisify的高级版本 `promisifyAll`，比如：

```javascript

var Promise = require('bluebird')
Promise.promisifyAll(fs)

```

执行完上面的代码之后，fs对象下所有的异步方法都会对应的生成一个Promise版本方法，比如fs.readFile对应fs.readFileAsync，fs.mkdir对应fs.mkdirAsync，以此类推。

另外要注意的就是，Promise版本的函数除了最后一个参数（回调函数），其它参数与原函数均一一对应，调用的时候别忘了传递原有的参数。

对fs的`promisification`还不能令我满足，我需要更神奇的魔法：

```javascript

// redis
var Promise = require("bluebird");
Promise.promisifyAll(require("redis"));

// mongoose
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));

// mongodb
var Promise = require("bluebird");
Promise.promisifyAll(require("mongodb"));

// mysql
var Promise = require("bluebird");
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

// request
var Promise = require("bluebird");
Promise.promisifyAll(require("request"));

// mkdir
var Promise = require("bluebird");
Promise.promisifyAll(require("mkdirp"));

// winston
var Promise = require("bluebird");
Promise.promisifyAll(require("winston"));

// Nodemailer
var Promise = require("bluebird");
Promise.promisifyAll(require("nodemailer"));

// pg
var Promise = require("bluebird");
Promise.promisifyAll(require("pg"));

// ...

```

少年，这下你颤抖了吗？

注：如果你正在使用mongoose，除了bluebird你可能还需要[**mongoomise**](https://github.com/simongfxu/mongoomise)，它的优点在于：

> * 能够接受任意的Promise Library (Q/when.js/RSVP/bluebird/es6-promise等等)
> * 支持对多个数据库实例进行promisify
> * 能够对Model自定义静态私有方法进行promisify，而bluebird.promisifyAll不支持
> * mongoomise + bluebird与仅使用bluebird性能相差无几，可能更好。

我们[**币须网**](http://www.coinxu.com)已经在生产环境中使用mongoomise + bluebird，目前为止一切安好。

注：

* node.js风格函数指的是这样的一种异步函数，它接受的最后一个参数是异步操作完成之后的回调函数，这个回调函数的第一个参数接受执行错误的Error对象，第二个参数接受成功返回值）。

* `promisify`大概的意思就是根据一个**node.js风格**的异步方法生成另一个等价的Promise风格的方法（这个方法返回值是一个Promise，其它形参与原方法相同除了没有最后一个回调函数），这个名词我最早是看到bluebird使用。

(未完待续 2014-07-15 23:40)