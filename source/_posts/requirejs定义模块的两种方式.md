---
title: RequireJS定义模块常用的两种方式
date: 2015-04-09
tags: JavaScript
---

RequieJS是一个遵循AMD规范的模块加载器，其定义模块的方式非常简洁，如下：

```
 define(id?, dependencies?, factory);
```

> - id为模块名称，字符串，可选参数
> - dependencies为本模块依赖的其它模块，数组，可选
> - factory为模块的实现，可以为一个对象或者函数，必填

最常见的定义模块的方式如下：

```
define(['jquery'], function($){
    var myModule = {
        add: function(a, b) {
               return a + b
       }
    }

    /*
     * 这里将对象直接返回即可
     * 返回函数也是可以的
     * 如果没有任何返回值，那么模块作为依赖被引入的时候就是undefined
     */
    return myModule
})
```

另外还有一种类似CommonJS的方式

```
define(['exports'], function(exports){
    exports.add =  function(a, b) {
        return a + b
    }
})
```

这种方式将CommonJS模块的转换为AMD风格的模块十分方便。

如果一个模块同时兼容AMD、CommonJS或者无模块系统的传统页面，那么就需要用到[UMD](https://github.com/umdjs/umd/blob/master/returnExports.js)

```
// root在浏览器里代表window对象，node里面则是global
;(function (root, factory) {
    // AMD
    if (typeof define === 'function' && define.amd) {
        define([], factory)
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory()
    } else {
        // 暴露出的全局变量
        root.moduleName = factory()
  }
}(this, function () {
    var myModule = {}
    return myModule
}))
```

参考文档

---

> - [AMD模块定义规范](http://segmentfault.com/a/1190000000761330)
> - [AMD：浏览器中的模块规范](http://www.cnblogs.com/snandy/archive/2012/03/12/2390782.html)
