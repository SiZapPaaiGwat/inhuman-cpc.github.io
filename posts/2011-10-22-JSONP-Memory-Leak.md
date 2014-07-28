

## 什么是JSONP？

`JSONP` （JSON with Padding）是资料格式 JSON 的一种“使用模式”，可以让网页从别的网域要资料。另一个解决这个问题的新方法是跨来源资源共享。

由于 `同源策略` ，一般来说位于 server1.example.com 的网页无法与不是 server1.example.com 的服务器沟通，而 HTML 的  `script`  元素是一个例外。利用 script元素的这个开放策略，网页可以得到从其他来源动态产生的 JSON 资料，而这种使用模式就是所谓的 JSONP。用 JSONP 抓到的资料并不是 JSON，而是任意的 JavaScript，用 JavaScript 直译器执行而不是用 JSON 解析器解析。

以上内容摘抄自：[JSONP@维基百科](http://zh.wikipedia.org/wiki/JSONP)

简而言之，JSONP就是WEB前端开发中最常用的一种 `跨域请求` 数据的方式。

## 使用场景

JSONP是一种常用的跨域请求脚本的方式。如果页面不涉及轮询，那也不是什么大问题。但是当页面中存在 `轮询` 跨域请求时，问题就被无数倍的放大了。所以需要额外小心由此带来的 `内存泄漏`！

当然毫无疑问，IE系列始终是最让人纠结的。

## 跨域加载脚本

通常我们使用下面的方式来加载一段脚本：

```javascript
	var script = document.createElement('script');
	script.src = 'http://www.abc.com/somepage?callback=check';
	script.id = 'JSONP';
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);
```

对于一般的WEB应用程序这并不存在什么问题，但是一旦你的应用程序中使用到了轮询，这样只增加节点而不删除，将导致内存不断增长，增长的比例和加载脚本执行的内容也有很大的关系。读者可以尝试向页面不断载入jquery源代码，设定轮询间隔为2s，可以看到内存的增速达到几十M每秒。

所以十分有必要在脚本执行完成以后删除这些script节点。

## 删除加载的script节点

 ```javascript
	var script = document.createElement('script');
	script.src = 'http://www.abc.com/somepage?callback=check';
	script.id = 'JSONP';
	script.type = 'text/javascript';
	script.charset = 'utf-8';
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);
	head.removeChild(script);
```

这样的方式可以吗？显然不行！

因为加载的脚本还没来的及执行就被删除了，所以我们需要 `让加载的脚本先执行一会儿` 。

### 曲线救国

```javascript
	setTimeout(function(){
		head.removeChild(script);
	},200);
```

不得不说，这样的解决方式很不优雅，要是脚本200ms内还没有执行完毕，肯定会出问题。所以需要保证脚本执行完之后自动删除。

## 加载script后自动删除节点

```javascript
	var script = document.createElement('script');
	head.appendChild(script);
	if(script.readyState){
		script.onreadysctatechange =function(){
			//注意使用this避免内存泄漏
			if(this.readyState == 'completed' || this.readyState == ''loaded)
				this.parentNode.removeChild(this);
		}; 
	}else{
		script.onload =function(){
			//注意使用this避免内存泄漏
			this.onload = null;
			this.parentNode.removeChild(this);
		};
	}
	script.src = url;
```

幸好IE支持 `onreadysctatechange` 事件，而标准浏览器支持 `onload` 事件来判断脚本的执行状态。

## IE浏览器下的问题

那么是不是现在我们的问题就解决了呢？

测试后发现这样的解决方案不能完全避免内存的不断增长，标准浏览器包括Chrome随着轮询的都会有内存增长的现象，
不过增长程度微乎其微（轮询间隔2m，增长速度也只有4k-8k）。但是IE会有十几到几十K的内存增长。

你会看到我们在script加载完成之后已经将script元素删除了，为什么内存还会不断增长呢？

很简单，这就是 `内存泄漏` 现象。

## 重用script节点

标准浏览器对script标签的处理就是每个script标签的地址（src）只能设置一次，
后续的设置能够改变地址，但是对应地址的脚本内容不会执行，不管script标签是页面预留的还是动态插入。

IE下面则很神奇，使用js动态插入的script标签不遵守这一规则。
于是我们只需要动态的插入一个id已知的script标签，然后不断地改变它的src，以此方式加载的脚本都会执行。 
而且这个script节点也不必删除，下次请求继续重用即可。 

这样IE下面的内存泄漏问题就解决了！

```javascript
	var _ = function(id){return document.getElementById(id);};
	_.ajax = function(){};
	(function(){
	    //存储超时或异常的JSONP请求
	    _.ajax.TIMEOUT_REQUEST = [];
		//超时设定
		_.ajax.TIMEOUT = 5000;
		if(_.isIE){
			//JSONP重用标签的id
			_.ajax.SCRIPT_ID = 'ie_script_for_jsonp';
			//重用标签是否被JSONP请求占用
			_.ajax.SCRIPT_USED = false;
			//被占用时JSONP请求等待的时间
			_.ajax.WAIT_TIME = 100;
			//上次JSONP请求的时间
			_.ajax.LAST_USED_TIME = 0;
			var script = document.createElement('script'), head = document.head || document.getElementsByTagName('head')[0];
			script.setAttribute('id',_.ajax.SCRIPT_ID);
			script.onreadystatechange = function(){
				if (this.readyState == "loaded" || this.readyState == "complete"){
					_.ajax.SCRIPT_USED = false;
				}
			};
			head.appendChild(script);
		}
	})();
	/**
	 * @description 轮询JSONP请求调用，IE浏览器采用重用Script节点方式。
	 * @param url 手动加上callback参数，自动追加了时间戳
	 **/
	_.ajax.jsonp = function(url){
		if(!navigator.onLine){
			_.ajax.TIMEOUT_REQUEST.push(url);
			return;
		}
		var script, now = new Date().getTime(), 
			requestUrl = url + (url.indexOf('?')>-1?'&timestamp=':'?timestamp=') + now,
			head = document.head || document.getElementsByTagName('head')[0];
		if(_.isIE && _.isIE < 9){
			script = document.getElementById(_.ajax.SCRIPT_ID);
			//节点被占用
			if(_.ajax.SCRIPT_USED){
				if(_.ajax.LAST_USED_TIME === 0)
					_.ajax.LAST_USED_TIME = now;
				//已经超时
				if((now - _.ajax.LAST_USED_TIME) > _.ajax.TIMEOUT){
					_.ajax.LAST_USED_TIME = now;
					if(_.ajax.TIMEOUT_REQUEST.length>=1000)
						_.ajax.TIMEOUT_REQUEST.length = 0;
					_.ajax.TIMEOUT_REQUEST.push(script.src.split('&timestamp=')[0]);
					script.src = requestUrl;
				//没有超时则等待
				}else{
					setTimeout(function(){_.ajax.jsonp(url);},_.ajax.WAIT_TIME);
				}
			}else{
				_.ajax.SCRIPT_USED = true;
				_.ajax.LAST_USED_TIME = now;
				script.src = requestUrl;
			}
		}else{
			script = document.createElement('script');
			head.appendChild(script);
			script.onload =	function(){
				this.onload = null;
				this.parentNode.removeChild(this);
			};
	        script.onerror = function(){
	            _.ajax.TIMEOUT_REQUEST.push(this.src);
	        };
			script.src = requestUrl;
		}
	};
```

## 测试结果

对上述代码测试，使用 `sieve` 结合任务管理器，发现此方法引起的内存泄漏和chrome下面的差不多都在4K左右，测试环境是IE 8。

```javascript
	var i = 0;
	window.onload = function(){
		setInterval(function(){
			_.ajax.jsonp('data.js');
		},1000);
	};
```

data.js 的内容：

``````javascript
	i++; 
```

##  后续说明

其实之所以存在内存泄漏，是因为IE的 `removeChild` 方法存在内存泄漏的问题。对于这一点 `jQuery` 的 `empty` 方法已经考虑到。关于removeChild导致内存泄漏的问题，很早就被发现了，具体请看[这里](http://groups.google.com/group/jquery-dev/browse_thread/thread/4a99f6e9b2e33057/45ce657a48afd43a?pli=1)。

一般的框架都有各自的删除节点的方式来避免内存泄漏问题，下面是 `EXT` 的处理方式：

```javascript
	_.dom = function(){};
	/**
	 * @description 采用ext的处理方式，也可以对删除的元素使用outerHTML=''，但是此方法不通用，某些元素的outerHTML属性只读
	 * @param n 要删除的HTML节点
	 */
	_.dom.remove = function(n){
		var d;
		if(_.isIE){
	        if(n && n.tagName != 'BODY'){
	            d = d || document.createElement('div');
	            d.appendChild(n);
	            d.innerHTML = '';
	        }
		}else{
		    if(n && n.parentNode && n.tagName != 'BODY'){
		        n.parentNode.removeChild(n);
		    }
		}
	};
```

为什么jQuery的 `getJSON` 在进行跨域请求时仍然存在比较严重的内存泄漏？或许是script节点不同于普通的html元素吧，无法按照上述方式删除吧。
