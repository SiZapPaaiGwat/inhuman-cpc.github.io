
前些天看到一个关于Ajax编码的问题，当时被提问者的描述绕的都想不清楚，今天闲来没事就整理下。原文地址在[这里](http://segmentfault.com/q/1010000000130593)。

## 问题描述

我的前端页面为GBK，所以待发送的数据肯定也为GBK，而由ajax的特性其在发送前其会被自动转换为utf-8
所以后台接收到的数据为utf-8的
然后我的后台页面编码为UTF-8，同时设置了response header中的编码参数也为UTF-8，那么前端收到的数据应该也是UTF-8
但前端页面为GBK，理论上来说这样会产生乱码，可是并没有，这是为什么呢？

提问者的描述有点混乱，而且各种绕，一不小心就会踩到提问者设的坑。

## 如何解决

彻底解决这个问题你首先需要了解以下几个知识点：

<ul>
	<li>页面表单提交到后台的数据编码与页面编码一致</li>
	<li>通过javascript提交到后台的数据都会被转换为utf-8格式</li>
</ul>

所以原则上这样理解，这个问题就差不多了：

	输入编码为UTF-8，后台以UTF-8方式输出，保证输入和输出一致那么自然就没有乱码问题。

要让别人相信自己，首先得自己相信自己，我们先不妨来几个测试。另外问题描述既然提到了后台的文本编码，我们也需要重点测试一下。

## 测试工作

准备以下页面：

* 主页面index.php
* ajax后台页面utf8.php
* ajax后台页面gbk.php

### 主页面 index.php，文本编码gbk

	<!docytype html>
	<html>
		<head>
			<meta charset="gbk"/>
			<script src="http://s.segmentfault.com/js/jquery.js?12.11.5.1"></script>
		</head>	
		<body>
			<button type="button" onclick="ajax_send('utf8')">JS提交(utf-8)</button>
			<button type="button" onclick="ajax_send('gbk')">JS提交(gbk)</button>
			<script type="text/javascript">
				var ajax_send = function(encoding){
					var xhr = new XMLHttpRequest(), params = encodeURI('t=编码')
					xhr.onreadystatechange = function(){
						if(this.readyState == 4 && this.status ==200)
							alert(this.responseText)
					}
					xhr.open('POST',encoding + '.php',true)
					xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhr.send(params)
				}
			</script>
		</body>

### utf8.php，文本编码utf-8

	<?php
	header('content-type:text/html;charset=utf-8');
	echo $_POST['t'];
	?>

### gbk.php，与utf8.php内容相同，区别就是文本编码为gbk

	<?php
	header('content-type:text/html;charset=utf-8');
	echo $_POST['t'];
	?>

启动Web Server，打开页面，分别点击按钮，都正确的弹出了“编码”二字，没有发现乱码现象。

## 结论

对于页面通过JS提交的数据：

<ul>
	<li>后台接口，只要保证输入输出的编码一致，提交的数据就会有乱码产生</li>
	<li>后台文件的文本编码以及前端页面的编码不会导致提交的数据返回时乱码，只要输入输出编码一致</li>
</ul>

对于以上两个结论，读者还可以这样测试。

	<?php
	header('content-type:text/html;charset=gbk');
	echo iconv("utf-8","gbk",$_POST['t']);
	?>

先将输入转码为gbk，然后输出同时设置为页面编码，这样也不会有乱码产生，但是服务端多了一道转码处理，效率不及直接输出utf-8。

对于后台附加的一些输出，比如在gbk.php中最后加一行
	
	echo "中文";

这种情况会不会导致乱码呢？读者可以自己测试一下。

## 深入

稍微搞过前端的人都知道，使用script标签引入脚本的时候，有一个属性是charset用于指定脚本文件的编码。当页面编码与引入脚本的文本编码不一致的时候需要显式指定，否则就会容易造成乱码。

现在我们仔细对比这两种场景的处理方式，不就是一模一样吗？只要保证输入输出的编码一致即可。唯一的区别就是一个是静态资源，一个是动态接口。

你有可能会问，当输入输出指定的编码不一致时是不是就一定是乱码呢，浏览器又该如何解析呢？

这个时候你就该来[这里](http://ued.taobao.com/blog/2011/08/26/encode-war/)看看了。

光棍节写博客，看来我是真光棍，真屌丝。













