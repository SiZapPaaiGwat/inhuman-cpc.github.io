---
title: Redux三分钟入门
date: 2016-02-21
tags: Redux
---

# Redux三分钟入门
## 什么是Redux？

对于前端页面，从数据层面来说，无非就是一系列的状态组合。
在传统的前端开发中，尤其是jQuery横行的年代，状态管理相关的理念一直没有什么起色。
自Flux横空出世以来，各种解决方案层出不穷，百花齐放，Redux也是在这种环境下诞生的。
如何描述Redux呢？
简而言之，它就是一个状态容器，里面存储了整个应用的所有状态。

> Redux的核心思想就是要提供**_可预测**_的状态管理，这对日益膨胀的大型应用来说尤其重要。

原谅我有一点标题党，因为对于从来没有听说过Redux的人来说，三分钟入门可能真的不够。
## 预备知识

Redux中有三个基本概念非常重要：store / reducer / action。
Store顾名思义就是状态容器，Redux使用**_createStore**_这个API来创建一个全局的状态容器。这里有一点比较重要的就是：

> Redux应用只能有一个单一的Store

我们暂时不用深究Redux为何如此设计。
Reducer是一个纯函数，它的职责就是用来更新状态容器中的状态，**_这也是Redux中更新状态的唯一途径**_。
Action是一个普通JavaScript对象，它是把数据从应用传递到状态容器的载体。
将action传递到store中很简单，使用store.dispatch(action)就可以了。

> 为了区分不同的数据来源，我们一般约定每个action都必须要有一个type字段。

这样我们的reducer函数就能根据这个type字段来决定如何修改状态容器。
掌握了上面的一些基本概念以后，我们就可以进入正题了，先上一段代码：
## DEMO

```
/**
 * Redux的两个核心API
 * createStore用于创建状态容器
 * combineReducers用于将多个reducers合并成一个Reducer
 */
let {createStore, combineReducers} = Redux

/**
 * 状态容器的初始状态
 * 一般用于同构应用，服务器端返回相关数据
 */
let INITIAL_STATE = {
  counter: {
    count: 0
  }
}

/**
 * reducer函数，用于变更状态容器中的状态
 * 如果action未知，则原样返回
 * 永远不要修改state，返回一个全新的state
 */
function counter(state = INITIAL_STATE.counter, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {count: state.count + 1}
    case 'DECREMENT':
      return {count: state.count - 1}
    default:
      return state
  }
}

/**
 * 状态容器三个核心方法：
 * subscribe用于监听事件，每当dispatch的时候会执行
 * dispatch用于分发action，这是改变状态容器中state的唯一途径
 * getState获取当前state
 */
let store = createStore(combineReducers({counter}), INITIAL_STATE)

store.subscribe(() =>
  console.log('获取当前状态容器：', store.getState())
)

store.dispatch({ type: 'INCREMENT' }) // count = 1
store.dispatch({ type: 'DECREMENT' }) // count = 0
```

[在线查看DEMO](http://codepen.io/simongfxu/pen/eJLwMb?editors=0012)
上面的DEMO代码逻辑大致如下：
1. 先定义reducer
2. 调用createStore创建store
3. 最后dispatch相关的action

对应到具体业务中的过程可能是这样：
1. 用户点击某个按钮
2. 然后状态容器dispatch这个action
3. action最后传达到reducer中
4. reducer根据action的内容来修改状态
5. 状态容器状态发生改变后触发视图更新

理解了上面的DEMO代码之后，Redux基本上就算入门啦！
## 后续深入

学习完上面的DEMO后，推荐你先看下Redux的一些[基本理念](http://camsong.github.io/redux-in-chinese/docs/introduction/ThreePrinciples.html)，了解Redux背后设计的前因后果，然后再针对性地围绕[Redux官网中文版](http://camsong.github.io/redux-in-chinese/index.html)学习（个人不太推荐从头到尾的精读，时间充裕的话请自便）。
