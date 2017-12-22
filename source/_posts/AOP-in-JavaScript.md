---
title: AOP in JavaScript
date: 2012-03-18
tags: JavaScript
---

## 基本概念

`面向侧面的程序设计`（aspect-oriented programming，AOP，又译作面向方面的程序设计、观点导向编程）是计算机科学中的一个术语，指一种程序设计范型。

该范型以一种称为侧面（aspect，又译作方面）的语言构造为基础，侧面是一种新的模块化机制，用来描述分散在对象、类或函数中的 `横切关注点` （crosscutting concern）。


## 使用目的

需要增强或者修改原有函数的功能，但并不直接修改原函数的内部逻辑。比如为函数添加 `前置` 和 `后置` 操作。

最常见的应用比如计算函数执行的时间、函数执行时的`日志记录`。

## 实际应用
在系统中有两个函数，func1和func2，func2是func1代码末尾的JSONP（跨域请求）回调。这两个函数内部逻辑相对复杂，代码也较多。

func1的执行频率是10秒一次，而客户端与服务器之间的网络并不能保证永远正常连接，除了后端有DNSPOD、反向代理等容灾方案，前端也要做一些容灾工作。

`如何容灾` ？就是在发现连续两次请求失败，就认定主服务器不可用，立刻在前端切换到备用服务器。
确定好这个思路以后剩下的就是在服务端添加各种配置，然后在前端为原有的func1加入请求超时的统计功能。

超时统计无非就是在func1的开始设置一个变量，func2结束后还原为初始值，如果在指定的超时时间段内发现变量未还原则判定为请求超时。

这段代码与原函数func1和func2均无逻辑关联，所以尽量不直接修改这2个函数的代码，
加之func1和func2已经相对复杂，若直接修改函数内部代码将导致代码复杂度加倍而且难于维护。

于是乎，AOP就派上用场了！

## 实现代码

```javascript
	var _ = function(id){return document.getElementById(id);};
	var GFRAME = {};
	GFRAME.name = 'GFRAME';
	GFRAME.func1 = function(x){
	    console.log(this.name,x);
	}
	/**
	 * @description AOP in JavaScript，不直接修改原函数而增强函数功能。未考虑前置操作的函数返回值的情况
	 * @param {Object} args {context:执行环境，name:函数名称，start:前置操作，end:后置操作}
	 **/
	_.inject = function(args){
	    var origin = args.name,
	        context = args.context || window,
	        start = args.start || (function(){}),
	        end = args.end || (function(){});
	    var temp = context[origin];
	    if(typeof temp != 'function')
	        throw Error(origin + ' is not a function in the given context.');
	    if(typeof start != 'function' || typeof end != 'function' )
	        throw Error('start and end is not a function in the given context.');
	    context[origin] = function(){
	        start.apply(this,arguments);
	        var ret = temp.apply(this,arguments);
	        end.apply(this,arguments);
	        return ret;
	    };
	};
```

## 使用方法

```javascript
	_.inject({
	    name:'func1',
	    context:GFRAME,
	    start:function(x){
	        console.log('start',this.name,x);
	    },
	    end:function(x){
	        console.log('end',this.name,x);
	    }
	});
	GFRAME.func1('test');
```

## 输出结果

```html
	start GFRAME test
	GFRAME test
	end GFRAME test
```

## 扩展阅读
*	[AOP@维基百科](http://zh.wikipedia.org/wiki/AOP)
*	[你相信么，只需一个函数5行JS代码即可在Javascript中实现完整的AOP功能](http://www.cnblogs.com/riceball/archive/2007/09/02/jsInject.html)
