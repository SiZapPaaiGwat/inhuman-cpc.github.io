---
title: Better React
date: 2016-02-04
tags: React
---

# Better React

使用Ractive（一个MVVM框架）编写组件的时候，我就经常想获取用户当前传入的attributes。
很无奈，Ractive并不支持此功能。为此我还专门提过一个[issue](https://github.com/ractivejs/ractive/issues/2059)。
React开始流行的时候，作为MVVM的爱好者我其实是比较抵触的。
后来发现势头不太对，感觉还是有必要了解下。
于是就抱着试一试的心理，开始了React的学习历程。
依稀记得当我首次接触props和state这对兄弟的时候，我的内心是十分激动的。

随着React学习的愈发深入，就愈发觉得掌握props和state的使用，对于掌握React整个基础体系是有多么重要。
今天本文就结合我自己的开发实践，讲讲使用props的一个基本原则。当然如果有更好的实践方法，烦请多交流。
## 一个典型

``` js
let Component = React.createClass({
  render() {
    let handleClick = () => {
      console.log('click handled')
    }
    return (
      <SubComponent onClick={handleClick} />
    )
  }
})
```

通常来说，子组件依赖父组件的某些变量、状态，或者需要更新父组件的UI这种需求还是很普遍的。
上例中父组件将一个handleClick函数作为prop传入给子组件，handleClick由于其作用域的天然优势可以将子组件的依赖问题层层化解，异常的简单方便。
这种将函数作为props传入子组件解决依赖问题的处理方式，也是目前React父子组件通信处理中一种非常普遍且流行的方式。

但是既然以此为例，那它肯定是反面典型了！
## 思考

下面我们以一个稍微复杂点的例子来看看这种处理方式的缺陷， [查看演示效果](http://codepen.io/simongfxu/pen/rxZBNz?editors=0010)。
试试点击演示中的Add按钮，然后查看控制台输出。

你会发现每点一次，底层的DumbCompoent的render都会触发一次。
照理说DumbComponent没有任何的props的变更应该不会rerender，为什么呢？
因为SmartComponent中传递prop的时候传递的是一个匿名函数，
DumbComponent在shouldComponentUpdate判断的时候由于onClick的引用不同而返回true。

如何修复呢？
很自然的你可能会想到将onClick这个函数缓存起来，这样引用就不会一直变了。
仔细思考一番其实这个方式并不可取，主要是因为：

> - 类似的prop越多，外层缓存的函数越多，代码风格极其不自然
> - 如果prop依赖于局部变量，缓存的方式异常麻烦甚至于无法解决
## 解决方案

避免将函数作为props传递，使用EventEmitter来对父子组件的依赖解耦。

如果不了解EventEmitter，可以看看这篇[文章](http://www.html-js.com/article/1649)。
浏览器端的实现我推荐[EventEmitter3](https://github.com/primus/eventemitter3)。
## 总结

为了避免不必要的麻烦，请不要将函数传入props中，取而代之使用EventEmitter。
遵循此原则，props始终传递基本类型或者只包含基本类型的对象。
在今后的React学习之路上，当你了解[ImmutableJS](https://github.com/camsong/blog/issues/3)时，这个原则将会让你深深受益。
