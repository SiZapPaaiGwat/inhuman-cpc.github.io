# React Native跨平台APP开发

- React Native 简介
- React 入门

---

## 起源

- Facebook
- Instagram
- 2013 React
- 2015 React Naitve (5000+ Star)

---

## 基本特点

- 声明式
- 组件化
- 一次学习，随处编写

---

## 革命性的 React

- 设计思想 *创新*
- 性能 *出众*
- 逻辑 *简单*

---

## UI = func (data)

- 数据驱动视图 *MVVM*
- 单向数据流动 *Flux*
- 函数式编程 *Functional*
- 虚拟DOM *想象力*

---

## 滚雪球

UI Engine ==> Web App ==> React Native

使用开发 Web 的方式开发 Native App

---

## 快速开始

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('example')
)
```

[在线演示](https://codepen.io/simongfxu/project/editor/XxbyeM#0)

---

## JSX

- Not template
- Pure JavaScript

```js
const names = ['Alice', 'Emily', 'Kate']

ReactDOM.render(
  <div>
  {
    names.map(function (name) {
      return <div>Hello, {name}!</div>
    })
  }
  </div>,
  document.getElementById('example')
)
```

---

## Transpile

Using BabelJS to compile code

```js
'use strict';

var names = ['Alice', 'Emily', 'Kate'];

ReactDOM.render(React.createElement(
  'div',
  null,
  names.map(function (name) {
    return React.createElement(
      'div',
      null,
      'Hello, ',
      name,
      '!'
    );
  })
), document.getElementById('example'));
```

---

## 组件化

使用 props 进行组件组合

```js
class HelloMessage extends React.Component {
  render: function() {
    return <h1>Hello {this.props.name}</h1>
  }
}

ReactDOM.render(
  <HelloMessage name="John" />,
  document.getElementById('example')
)
```

[View code](http://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&code_lz=MYGwhgzhAEASCmIQHsCy8pgOb2vAHgC7wB2AJjAErxjCEB0AwsgLYAOyJph0A3gFDRoAJ1Jl4wgBQBKPoKEj4hAK7CS0ADwALAIwA-BEmR9CWgJYR6bYcjaWSYFvAC-GgPS6985_x_9qtIQAIgDyqPSi5BKS8hqGKOiYONAOTgC8AEQAUshaJBnQbnoANPJkyMDKTiQMOIQAoiDw1YQAQgCeAJJkkgDkBI5sTb3S_NJAA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&lineWrap=true&presets=es2015%2Ces2016%2Ces2017%2Creact%2Cstage-0%2Cstage-2&prettier=false&targets=&version=6.26.0&envVersion=)

---

## this.props.children

this.props 对象的属性与组件的属性一一对应，但是有一个例外

```js
const NotesList = React.createClass({
  render: function() {
    return (
      <ol>
      {
        React.Children.map(this.props.children, function (child) {
          return <li>{child}</li>
        })
      }
      </ol>
    )
  }
})

ReactDOM.render(
  <NotesList>
    <span>hello</span>
    <span>world</span>
  </NotesList>,
  document.body
)
```

---

## this.state

> React 的一大创新就是将组件看成是一个状态机，
有一个初始状态，然后用户交互，导致状态变化，从而触发重新渲染 UI

```js
export default class LikeButton extends React.Component {
  state = {
    liked: false
  }

  handleClick =  (event) => {
    this.setState({
      liked: !this.state.liked
    })
  }

  render () {
    const text = this.state.liked ? 'like' : 'haven\'t liked';
    return (
      <p>
        You {text} this. <br />
        <a href="javascript:;" onClick={this.handleClick}>Click</a> to toggle.
      </p>
    )
  }
}
```

[View demo](https://codepen.io/simongfxu/project/editor/XxbyeM#0)

---

## 组件的生命周期

Component Mounting lifecycle 首次渲染到 DOM

- constructor()
- componentWillMount()
- render()
- componentDidMount()

Component Updating lifecycle 后续更新

- componentWillReceiveProps()
- shouldComponentUpdate()
- componentWillUpdate()
- render()
- componentDidUpdate()

---

## React vs 传统方式

![vdom](https://www.ibm.com/developerworks/cn/web/1509_dongyue_react/index6639.png)

---

## 如何更新

先进的 diff 算法，最小化当前节点操作

![update](https://www.ibm.com/developerworks/cn/web/1509_dongyue_react/index7038.png)

---

## 实战演练

### 目标：

使用 React 完成一个简单的时间展示控件，能够实时展示当前时间的时分秒。
比如当前时间是 “2018-04-11 19:20:05” 则展示 “19:20:05”

[Go](https://codesandbox.io/s/r7jk7mwmro)

---

## Resources

- [React 文档](https://doc.react-china.org/)

---

## 课后习题

完成一个类似 iPhone 秒表的小应用。要求实现如下功能：

- 开始功能：开始秒表，开始后每隔 100 毫秒，界面更新
- 展示当前消耗的时间，格式如：00:16.7
- 暂停功能：暂停秒表，暂停后界面定格
- 重置功能：重置秒表，界面更新为 00:00，重置后可以继续开始秒表

> 推荐使用 [codesandbox](https://codesandbox.io) 这个在线编辑器
