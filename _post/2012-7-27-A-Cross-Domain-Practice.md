---
layout: page
title: A Cross Domain Practice
category: javascript ruby sinatra
tags: [JavaScript, Ruby, Sinatra]
tagline: 一次跨域实战
---

{% include JB/setup %}

## 项目需求

对一个照片列表页面的每张图片在前端进行下载耗时统计，并定期上报。

## 基本思路

使用`XMLHttpRequest`下载图片，实现下载耗时统计。上报功能则一次上报`localStorage`存储的多张图片的统计信息，这里不做讨论

## 问题难点

使用`XMLHttpRequest`需要跨域访问图片服务器

## 其它说明

**项目只服务于移动终端，本文的一切测试原则上只涉及`Webkit`系列的浏览器

**为了方便快捷地看到效果，后台使用`Ruby`语言的轻量级框架`Sinatra`

**使用`127.0.0.1`访问`localhost`模拟跨域图片请求

## 项目文件

**前端测试主页面 `test.html`

**后台请求处理文件 `myapp.rb`

**一张测试图片 `london.jpg`，大小47714B

## 代码预览

### test.html
	
	```html
	<!doctype html>
	<html lang="zh-CN">
		<head>
			<meta charset="utf-8" />
		</head>
		<body>
			<h1>跨域获取图片的文件大小</h1>
			<button id="send">Send Ajax Request</button>
			<script>
				+function(){
					var xhr = new XMLHttpRequest(),
						host = location.href.indexOf('localhost')>-1?'127.0.0.1':'localhost',
						url = 'http://' + host + ':4567/img'
					xhr.onload  = function(e){
						console.log(e)
					}
					xhr.onerror = function(a){
						console.log(a)
					}
					var send = document.getElementById('send')
					send.addEventListener('click',function(){
						xhr.abort()
						xhr.open('GET', url, true)
						xhr.send(null)
					},false)
				}()
			</script>
	```

### myapp.rb

	```ruby
	# myapp.rb
	require 'rubygems'
	require 'sinatra'

	get '/' do
		send_file 'test.html'
	end

	#跨域请求
	get '/img' do
		send_file 'london.jpg'
	end
	```
	
## 开始工作

启动web server以后就开始我们的测试工作了。打开`chrome`及其`控制台`，输入 http://localhost:4567/，点击页面中的按钮，不出意外你会在chrome控制台看到下面的错误提示。

`XMLHttpRequest cannot load http://127.0.0.1:4567/img. Origin http://localhost:4567 is not allowed by Access-Control-Allow-Origin.`

因为我们对跨域访问没有进行任何设置，所以自然无法通过浏览器内在的`同源安全机制`。

## 实现跨域访问

google如何实现跨域访问，很快找到了一种方法。在网站根目录放置`crossdomain.xml`的配置文件，就可以完美地实现跨域访问。难怪qq.com和taobao.com都不约而同的配置了这个文件，该文件的格式一般如下：

	<cross-domain-policy>
		<allow-access-from domain="*.site.com"/>
		<allow-access-from domain="*.site.net"/>
		<allow-access-from domain="*.sitecdn.com"/>
	</cross-domain-policy>

经过一番测试，发现这样还是无法实现跨域访问。后来终于知道crossdomain.xml文件是flash跨域专用，而且据说已经被Adobe公司申请为专利。看来这条路是走不通了。

于是继续google，终于在[这里](http://www.w3.org/TR/cors/)看到了一切关于我们想要的。，可惜`w3c`的文档总是那么地冗长而乏味，令人望而生畏。比如在介绍这个`Access-Control-Allow-Origin`的响应头如何设置时，看着这里的介绍是" origin-list-or-null | "*"，我以为可以一次性设置多个origin，比如
a.com,b.com,c.com。一番折腾之后发现这样设置和没有设置是一样的效果，如果不设置为星号就只能设置一个站点。那我们就暂时设置为"*"吧，安全问题稍后再考虑！修改我们的后台代码，加入一个全局的`过滤器`设置响应头，下面是修改后的myapp.rb文件：

	```ruby
	# myapp.rb
	require 'rubygems'
	require 'sinatra'

	get '/' do
		send_file 'test.html'
	end

	#跨域请求
	get '/img' do
		send_file 'london.jpg'
	end

	after do
		headers\
		'Access-Control-Allow-Origin' => '*'
	end
	```

现在我们重启web server和浏览器，继续输入http://localhost:4567/，点击页面中的按钮发起跨域请求，查看crhome控制台，没有发现错误，请求顺利完成。那就让我们看看`Network`中的跨域访问请求到底多了些什么：

*Access-Control-Allow-Origin:*

*Connection:Keep-Alive

*Content-Length:47714

*Content-Type:image/jpeg

*Date:Fri, 27 Jul 2012 07:11:42 GMT

*Last-Modified:Fri, 27 Jul 2012 02:52:45 GMT

*Server:WEBrick/1.3.1 (Ruby/1.8.7/2011-12-28)

*X-Frame-Options:sameorigin

*X-Xss-Protection:1; mode=block

果然我们设置的响应头`Access-Control-Allow-Origin`生效了，太神奇了！通过服务器和浏览器的协作，我们轻松地实现了跨域访问。现在看来W3C搞的这些跨域访问控制的标准还是比较靠谱的啊，如果说有什么缺点，那就是设置多个站点的时候麻烦了点（比如qq.com需要配置跨域访问控制的话），其它的缺点一时我还真说不出来。

## 读取图片的文件大小

目前为止，我们算是成功地实现了跨域请求，但是离我们的目标还差一点。我们还需要知道这个图片的文件大小，从之前服务器输出的响应头来看，应该就是`Content-Length`这个响应头了。那就修改下我们的页面代码，获取这个响应头吧：

	```html
	<!doctype html>
	<html lang="zh-CN">
		<head>
			<meta charset="utf-8" />
		</head>
		<body>
			<h1>跨域获取图片的文件大小</h1>
			<button id="send">Send Ajax Request</button>
			<script>
				+function(){
					var xhr = new XMLHttpRequest(),
						host = location.href.indexOf('localhost')>-1?'127.0.0.1':'localhost',
						url = 'http://' + host + ':4567/img'
					xhr.onload  = function(e){
						console.log(this.getResponseHeader('Content-Length'))
						console.log(this.responseText.length)
					}
					xhr.onerror = function(a){
						console.log(a)
					}
					var send = document.getElementById('send')
					send.addEventListener('click',function(){
						xhr.abort()
						xhr.open('GET', url, true)
						xhr.send(null)
					},false)
				}()
			</script>
	```
	
刷新页面，打开控制台，点击按钮，一个红色的错误呈现在我们眼前：

`Refused to get unsafe header "Content-Length"`

怎么样让浏览器服软允许脚本获取这个响应头呢？还是继续去w3c的文档找找吧。很幸运，这个`Access-Control-Expose-Headers`似乎和我们的需求很匹配啊，不妨在过滤器中加入输出这个响应头来试一试：

	# myapp.rb
	require 'rubygems'
	require 'sinatra'

	get '/' do
		send_file 'test.html'
	end

	#跨域请求
	get '/img' do
		send_file 'london.jpg'
	end

	after do
		headers\
		'Access-Control-Allow-Origin' => '*',
		'Access-Control-Expose-Headers' => 'Content-Length'
	end

重启web server，刷新页面，打开chrome控制台，点击按钮。没有任何错误，顺利输出两个数值：47714，45926。看来已经能够顺利的获取到Content-Length响应头，而且数值也很准确，和文件大小一致。但是这个`responseText`为什么少了接近2KB呢？还请高人解答。

一切都很顺利，不过虽然只针对webkit系浏览器，至少也得测试下safari吧。打开safari及其控制台，输入url，点击按钮，居然抛出了和之前未设置`Access-Control-Expose-Headers`时一样的错误：

`Refused to get unsafe header "Content-Length"`

是不是浏览器缓存的问题呢？重启浏览器再测试，问题依旧。看来这应该就是safari的bug了。既然safari不支持，那就意味着我们前端脚本无法使用`getResponseHeader`了，那问题该如何解决呢？让我们再看看w3c上关于`XMLHttpRequest Level 2`的实现还有属性和函数我们可能用得上，继续找啊...终于发现XMLHttpRequest Level 2有一个[onprogress](http://www.w3.org/TR/XMLHttpRequest2/#handler-xhr-onprogress)事件和[ProgressEvent](http://dvcs.w3.org/hg/progress/raw-file/tip/Overview.html#progressevent)对象，于是修改我们的页面代码如下：

	<!doctype html>
	<html lang="zh-CN">
		<head>
			<meta charset="utf-8" />
		</head>
		<body>
			<h1>跨域获取图片的文件大小</h1>
			<button id="send">Send Ajax Request</button>
			<script>
				+function(){
					var xhr = new XMLHttpRequest(),
						host = location.href.indexOf('localhost')>-1?'127.0.0.1':'localhost',
						url = 'http://' + host + ':4567/img'
					xhr.onprogress  = function(e){
						if(e.lengthComputable){
							if(e.loaded/e.total == 1){
								//invoke onload
								console.log(e.total)
							}
						}
					}
					xhr.onerror = function(a){
						console.log(a)
					}
					var send = document.getElementById('send')
					send.addEventListener('click',function(){
						xhr.abort()
						xhr.open('GET', url, true)
						xhr.send(null)
					},false)
				}()
			</script>

细心的同学可能会问为什么不在`onload`中执行相关操作，其实经我测试发现onload之后`e.total`和`e.loaded`已经被设置为0，虽然`responseText`依然可读，但是这与真实的文件大小有一点的误差。

## 最后的完善

虽然我们的目标已经完成，但是我们的工作还没有结束。因为服务端存在一个严重的`安全隐患`。我们草率地将`Access-Control-Allow-Origin`设置为”＊“，不可避免地为一些黑客攻击创造了便利条件。

其实，既然我们的跨域访问只开放给部分信任的站点，那么我们只需要在后台的过滤器中判断请求来源是否属于白名单之中，如果存在则输出Access-Control-Allow-Origin响应头，内容为该站点域名。至于这个白名单的设计，可以参考`Apache`（之前一直误以为Apache的做法是业界的标准）。

另外跨域访问控制一般针对的是Ajax请求，所以我们还可以在过滤器中加入一个是否是Ajax请求的判断(服务端判断请求头中是否包含`X-Requested-With`:`XMLHttpRequest`)，避免为普通的请求也加入`Access-Control-Allow-Origin`这个响应头。

最后由于各浏览器对`Access-Control-Expose-Headers`的实现并不完善，所以这个响应头就显得异常鸡肋。








	










