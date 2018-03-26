---
title: JavaScript Parser资源总结
date: 2016-07-17
tags: JavaScript,解析器
---

## 理解抽象语法树(AST)

[Abstract syntax tree - 维基百科](https://en.wikipedia.org/wiki/Abstract_syntax_tree)

[抽象语法树在 JavaScript 中的应用 - 美团点评技术团队](http://tech.meituan.com/abstract-syntax-tree.html)

[JavaScript的抽象语法树与语法解析](http://wwsun.github.io/posts/javascript-ast-tutorial.html)

[通过开发 Babel 插件理解抽象语法树](http://www.zcfy.cc/article/347)
## JavaScript Parser
- [Esprima](http://esprima.org/)
- [Acorn](https://github.com/ternjs/acorn)
- [Babylon](https://github.com/babel/babylon)

Parser建议从Esprima开始学习，相比较于其它Parser文档和示例更加丰富和形象。

Acorn的性能和效率比Esprima更胜一筹，但是文档比较匮乏。

Babylon是Babel的JavaScript Parser，早期也是fork的Acorn，目前关注度不及其它Parser。

推荐一种比较好的实践方式：从npm中的找出几个[依赖于这些Parser](https://www.npmjs.com/browse/depended/acorn)的项目直接学习源代码。比如[amd2cmd](https://www.npmjs.com/package/amd2cmd)这个项目就是使用acorn将amd代码转换为cmd代码。
## 周边工具

[AST explorer](https://astexplorer.net/)

更直观的理解各个Parser生成的AST。

[ECMAScript Tooling](https://github.com/estools)

各种用于AST以及辅助的相关工具，比如[estraverse](https://github.com/estools/estraverse)用于遍历AST，[escodegen](https://github.com/estools/escodegen)用于从AST生成源代码。

[Babel 插件手册](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)
