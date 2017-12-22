---
title: 美妙的函数之isArguments
date: 2015-04-02
tags: JavaScript
---

判断变量是否为Arguments对象没有想象中的那么简单，你可能会使用下面这种方法：

```
Object.prototype.toString.call(value) === '[Object Arguments]'
```

我们先来看看著名的es5-shim是如何实现的。

```
var _toString = ObjectPrototype.toString;

var isFunction = function(val) {
    return ObjectPrototype.toString.call(val) === '[object Function]';
};

var isArguments = function isArguments(value) {
    var str = _toString.call(value);
    var isArgs = str === '[object Arguments]';
    if (!isArgs) {
        isArgs = !isArray(value) && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && isFunction(value.callee);
    }
    return isArgs;
};
```

因为某些浏览器的[buggy](https://github.com/lodash/lodash/blob/master/lodash.src.js#L1004)行为，这个方法不得不这么长。再看看[lodash](https://github.com/lodash/lodash/blob/master/lodash.src.js#L8480)的实现：

```
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

function isObjectLike(value) {
    return !!value && typeof value == 'object';
}

function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

function isArguments(value) {
  var length = isObjectLike(value) ? value.length : undefined;
  return isLength(length) && objToString.call(value) == argsTag;
}


// Fallback for environments without a `toStringTag` for `arguments` objects.
if (!support.argsTag) {
  isArguments = function(value) {
    var length = isObjectLike(value) ? value.length : undefined;
    return isLength(length) && hasOwnProperty.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };
}
```

对比两种实现，es5-shim仅仅只是做了arguments对象特有的属性检测，而lodash的实现不论是从代码可读性还是严谨方面来考察都是极其完美的。
