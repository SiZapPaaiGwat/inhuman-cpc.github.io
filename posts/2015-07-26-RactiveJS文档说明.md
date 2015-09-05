# RactiveJS文档说明

`RactiveJS`是一款优秀的MVVM框架，也是DataEye前端技术使用到的核心框架之一。
关于其使用说明可以参考[官方文档](http://docs.ractivejs.org/latest/get-started)。
不过由于官方文档太大太全，而且没有中文版，所以本文会摘选最常用的部分依次介绍。

## 构造函数配置属性

下面几项是平常项目中经常会使用到得配置项目：

配置项 | 用途
------ | ------
isolated | 是否隔离组件，防止其访问上级组件内部数据
partials | 局部模板，一个很重要的用途是在组件内动态地引用。{{>partialName}}
el | 组件渲染的节点
data | 组件初始化时的模板数据
computed | 计算属性，封装某些复杂的模板输出指令
magic | 设置为true，直接修改数据后视图自动更新
modifyArrays | 默认为true，使用push/splice等数组常用的修改方法操作data里的数组自动更新视图

## 默认数据

有些时候我们需要为配置属性提供默认值：

```js
// 使用[[]]替换模板的开始和结束标签{{}}
Ractive.defaults.delimiters = [ '[[', ']]' ]

// 现在模板中的isOpen就是true了
Ractive.defaults.data.isOpen = true
```

## 模板

RactiveJS内部模板基于`Mustache`改造，大部分使用方法都极其简单：

输出普通变量(转义与不转义)：

```html
<div>{{userName}}</div>
<div>{{{userInput}}}</div>
```

输出列表：

```html
<ul>
	{{#list}}
		<li>{{.label}} - {{.value}}</li>
	{{/list}}
</ul>
```

输出列表时获取索引：

```html
<ul>
	{{#list:i}}
		<li>{{i}}: {{.label}} - {{.value}}</li>
	{{/list}}
</ul>
```

if/else:

```html
{{#if isOpen}}
	<div>isOpen非空时显示这里</div>
{{elseif isSelected}}
	<p>isSelected非空时显示这里</p>
{{else}}
	<p>其它情况显示这里</p>	
{{/if}}

{{^isOpen}}
	<div>等价于 if not isOpen。不过建议始终使用#if来代替</div>
{{/isOpen}}
```

因为RactiveJS的模板每个版本都会加入一些新的特性，建议不定期阅读 [http://docs.ractivejs.org/latest/mustaches](http://docs.ractivejs.org/latest/mustaches)










