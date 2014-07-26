---
layout: page
title: Disaster Tolerant in JavaScript
category: javascript
tags: [JavaScript, AOP]
tagline: 前端容灾方案
---

{% include JB/setup %}

## 应用场景

存在轮询的AJAX或者JSONP跨域请求的Web应用。

比如我们有两台服务器，分别是a.com和a-bk.com，默认的轮询请求使用a.com；

当a.com由于某种原因无法访问，需要按照一种事先约定的机制，将后续请求指向到备用服务器。

同时当主服务器正常时，立即切换到主服务器。

## 现实项目

在我们的应用中，JSONP轮询的频率是每十秒一次。由于移动机房经常性的故障，导致客户长时间不能正常访问。

于是客户经常向我们报障，试想如果此时，前端能够将用户的后续访问切换到我们的电信服务器，那该多好啊！

虽然响应会慢一些，但是至少整个系统处于可用状态。

## 容灾机制

经过和同事们的一番讨论最后确定我们的容灾机制：

连续两次请求没有及时应答则认定当前服务器不可用，切换到备用服务器；

同时发起一个定时器，每55秒检测主服务器是否可用（访问主服务器上的一张43b的图片），一旦可用，立刻切换到主服务器。

## 实现逻辑

确定好容灾机制以后，剩下的就是编码了。

不过编码之前其实还有一个隐藏的重大问题，那就是我们如何确定这个请求是否超时？

因为我们的跨域JSONP请求都是使用script tag，而且需要兼容IE 6,自然没有什么类似的ontimeout事件去检测。

那我们就只有自己动手来处理了。

对于单个请求超时的判断，我们可以在主函数启动时设置一个状态量为false，回调函数中修改这个值为true。

由于需要尽量避免修改原函数逻辑，这里用到了 `AOP` 技术，详细参见[这里](http://xugaofan.github.com/javascript/2012/03/18/AOP-in-JavaScript/)

### 方案一

每一次发起JSONP请求后，开启一个setTimeout 8秒后去检测状态量是否被修改（变量由回调函数修改），依此判断响应成功与否。

### 方案二

建立一个对象，给每一次请求标记ID，将其使用的服务器地址和响应结果记录下来；

在第N次请求发起之前，判断第N-2次和N-1次请求是否使用相同的服务器，如果是，当这两次请求都没有及时响应时切换到备用服务器。

### 比较结果

方案一对每次请求都在下一次轮询之前就决定它是成功还是失败。我在生产中设置的值是6.5秒，但发现许多客户经常在主服务器和备用服务器上来回切换。

方案二的好处在于，首先没有发起额外的setTimeout来监测请求成功是否响应，其次对于每一次请求方案二的超时时间实际是一个动态的值。

对比下就知道方案一对每个请求的超时容忍度都是相同的6.5秒，最大也只能是10秒，而方案二第N-2次的超时容忍时间是20秒，第N-1次是10秒。

所以严格意义上来讲，方案二更宽容也更加合理。

## 编码实现

	/**
	* @description 网络模块
	* @property {Number} DETECT_CYCLE 切换到备用服务器后，监测主域名的周期，单位为秒，周期长度最好不要设置为10的倍数，便于调试观察
	*/
	_.net = { DETECT_CYCLE:55 };
	/**
	* @description 为跨域请求函数注入容灾备份机制，需要将原函数的请求服务器地址改成_.net['funcname_current_server'];
	* 实现原理：使用对象存储每一次请求使用的服务器地址和请求结果，然后在每一次请求之前，判断前两次使用相同服务器的请求是否都不成功。
	* 如果都不成功表明连续两次请求失败则切换到备用服务器
	* @param {Object} entry 入口函数{context:执行环境,name:函数名称}
	* @param {Object} exit 回调函数{context:执行环境,name:函数名称}
	* @param {Object} settings 服务端配置{server:主域地址,backupServer:备选服务器地址，数组，长度为0则不启用容灾机制,serverImg:监测主域名可用的图片}
	* @param {Function} forward 动态判断是否在入口函数继续执行注入的容灾机制
	* @usage 参见/user/js/map.js
	* @dependacy {Function} _.inject
	*/
	_.net.backup = function(entry,exit,settings,forward){
		var server = settings.server,currentServer = entry.name + '_current_server';
		_.net[currentServer] = server;
		//没有备用地址则不启动容灾备份机制
		if(!settings.backupServer || !_.isArray(settings.backupServer) || !settings.backupServer.length) return;
		var interval = entry.name + '_interval',//切换到备用以后发起定时器key_name
			total = entry.name + '_total',//总的请求次数key_name
			status = entry.name + '_status',//维护各次请求的地址和请求结果key_name
			serverAvailable = entry.name + '_server_available';//表明当前主服务器是否可用的key_name
		//主服务器可用时立即切换，并重置对应的变量
		var resetServer = function(){
			_.net[serverAvailable] = true;
			_.net[currentServer] = server;
			clearInterval(_.net[interval]);
		};
		//筛选服务器算法，如果当前使用主服务器则切换到备用，如果已经是备用，有多个备用时则切换到下一个备用，只有一个备用是切换到主服务器
		var selectServer = function(){
			if(_.net[currentServer] == server){
				return settings.backupServer[0];
			}else{
				var len = settings.backupServer.length;
				if(len ==1)
					return server;
				var index = _.indexOf(settings.backupServer,_.net[currentServer]);
				return settings.backupServer[index+1] || settings.backupServer[0];
			}
		};
		_.net[serverAvailable] = true;
		_.net[interval] = null;
		_.net[total] = 0;
		_.net[status] = {};//格式：{1:['http://a.net/',true], 2:['http://a.net/']}
		entry.start = function(){
			if(typeof forward == 'function'){
				if(!forward())return;
			}
			_.net[total] += 1;
			var count = _.net[total];
			//存储当此请求使用的服务器地址和响应结果
			_.net[status][count-1] = [];
			if(count > 2){
				var prev = _.net[status][count-2], prevPrev = _.net[status][count-3];
				//上两次请求使用同一个服务器且都失败了，则切换服务器
				if(prev[0] == prevPrev[0] && !prev[1] && !prevPrev[1]){
					var usingServer = _.net[currentServer] == server, old = _.net[currentServer];
					if(usingServer){
						_.net[interval] = setInterval(function(){ 
							var img = new Image();
							img.onload = resetServer;
							img.src = settings.serverImg + (settings.serverImg.indexOf('?')>-1?'&':'?') + 't=' + new Date().getTime();
						}, _.net.DETECT_CYCLE*1000);
					}
					//如果只有一个备用服务器且备用不可用则立即切换到tbo
					if(!usingServer && settings.backupServer.length==1){
						resetServer();
					}else{
						_.net[currentServer] = selectServer(_.net[currentServer]);
						_.net[serverAvailable] = _.net[currentServer] == server;
					}
					if(settings.errorHandler){
						settings.errorHandler(old,_.net[currentServer]);
					}
				}else{
					//如果备用服务器一直正常，那么需要一直检测主域名是否可用，如果可用立即切换到主域名
					if(_.net[currentServer] != server){
						if(_.net[serverAvailable]){
							resetServer();
						}
					}
				}
				//删除冗余信息，保证数组长度为2
				delete _.net[status][count-3];
			}
			//记录当此请求使用的服务器地址
			_.net[status][count-1][0] = _.net[currentServer];
		};
		exit.start = function(){
			//标记本次请求成功，不成功的请求数组长度为1
			_.net[status][_.net[total]-1][1] = true;
		};
		_.inject(entry);
		_.inject(exit);
	};
















