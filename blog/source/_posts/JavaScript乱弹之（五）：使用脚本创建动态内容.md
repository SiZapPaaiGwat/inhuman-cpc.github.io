---
title: JavaScript乱弹之（五）：使用脚本创建动态内容
date: 2010-01-29
tags: JavaScript
---

## document.write()

所有支持脚本的浏览器都可以在正文中嵌入document.write()语句。利用它你可以动态的创建内容，不过使用它你需要十分小心。最常见的错误就是在页面加载完毕以后调用，以修改或向页面添加内容。这样的结果只会是用你组装的脚本内容替换掉你的当前页。

## 创建节点
创建动态内容标准的方法是使用W3C的document对象的元素创建方法。

```js
var elem=document.createElement("p");
//参数名可以是大写也可以是小写，但是元素elem.tagName的返回值永远是大写。
createAttribute( attributeName )
createComment( commentString )
createDocumentFragment()
createTextNode( textString )
```

以上方法全部返回一个节点对象（node object），在没有进行插入操作时，以上方法并不影响DOM的结构。

## 插入和附加节点
**insertBefore( newChildNode, referenceNode )**

在现有的子节点前插入一个节点
使用方法：parentnode.insertBefore(newNode,childnode)，当childnode为null时作用与appendChild相同。

**appendChild( newChildNode )**

将节点添加到指定的节点的最后一个子节点的后面
使用方法：parentnode.appendChild(newNode);

## 移除、替换和复制节点
**removeChild( childNode )**

**replaceChild( newNode, nodeToReplace )**

**cloneNode( true/false)**

True表示深克隆，所有子节点也被克隆；false表示浅克隆，不会复制子节点。
设置节点的属性

有两种常用的方式：

```js
var elem=document.createElement("div");
elem.setAttribute("id","testDIV");
elem["id"]="testDIV";
```

浏览器能够同等识别以上两种方法，W3C推荐第一种，但是由于第一种在IE经常无法改变属性的值，所以最好还是用第二种。

**innerHTML**

IE4引入了两个基于文本的元素对象属性：**innerText**和**innerHTML**，由于innerHTML的大量使用而且实用性很强，以至于原本那些许多以“标准”自居的浏览器在严格遵守
W3C DOM戒律方面有所放宽，并实现了innerHTML。FireFox并不支持innerText。
请你记住innerHTML的开创者是IE！

节点的常用属性
> * nodeName
> * nodeValue
> * nodeType
> * parentNode
> * childNodes
> * Attributes
> * firstChild
> * lastChild
> * ownerDocument
> * previousSibling
> * nextSibling
> * tagName

# nodeType对应值与类型

> * 1 Element
> * 2 Attribute
> * 3 Text
> * 8 Comment
> * 9 Document
> * 10 DocumentType

自定义的insertAfter方法

```js
function insertAfter(newEl, targetEl){
            var parentEl = targetEl.parentNode;
                        if(parentEl.lastChild == targetEl)
            {
                parentEl.appendChild(newEl);
            }else
            {
                parentEl.insertBefore(newEl,targetEl.nextSibling);
            }            
}
```

思路：首先找到目标节点的父节点，如果目标节点是父节点的最后一个子节点，则使用appendChild方法；如果不是最后一个节点则使用JavaScript内置的insertBefore方法插入到目标节点的下一个兄弟节点之前。

使用方法：

```js
var txtName = document.getElementById("txtName");
var htmlSpan = document.createElement("span");
htmlSpan.innerHTML = "This is a test";
insertAfter(htmlSpan,txtName);
```
将htmlSpan 作为txtName 的兄弟节点插入到txtName 节点之后
