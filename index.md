---
layout: page
title: 
tagline: 
---
{% include JB/setup %}


## 文章列表

<ul class="posts">
  {% for post in site.posts %}
    <li> <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>&nbsp;&nbsp;&nbsp;
    	<span>{{ post.date | date_to_string }}</span></li>
  {% endfor %}
</ul>

<!--
## 毕业大事记

### 2008

**考研中的各种坑爹事（`黑中介`、`借钱`、`失眠`、`安眠药`、`DOTA`）


### 2009

**考研失败

**结识第一个老板 `Gavin`

**从事  `C#` 开发

### 2010

**Web开发登堂入室

**接触各种 `证明` 以及 `证`

### 2011

**首战深圳，换工作失败

**`asp.net` 转型  `JavaScript`

**再战深圳，顺利入职 `谷米科技`

### 2012

**购得第一部苹果产品，13寸的 `MacBook Air`

**跳槽到 `腾讯公司`
-->
<!-- ## 社交工具

-	[Google Plus](https://plus.google.com/u/0/101228485753010598030/posts)
-	[新浪微博](http://weibo.com/xugaofan)
-	[腾讯微博](http://1.t.qq.com/xugaofan)
-	[人人网](http://www.renren.com/230452650) -->


