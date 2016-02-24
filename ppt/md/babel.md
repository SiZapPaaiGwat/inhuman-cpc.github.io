现代JavaScript开发
使用Babel开始下一代JavaScript开发

ECMAScript历史
1995 - 发明,
1999 - ES3,
2007 - ES4,
2009 - ES5,
2015 - ES6

ECMAScript5
Object[keys/create/seal/defineProperty/getOwnPropertyNames...]
Array[isArray/indexOf/forEach/every/some/map/reduce/filter...]
Function.bind /Date.now/String.trim/JSON/Object(getter/setter)

ECMAScript6
箭头函数/class/模板字符串/参数默认值/解构/模块/对象展开/Promise/...

ECMAScript201X

未来很美好
现实很残酷

Babel
一个转译(transpiling)工具,把用最新标准编写的JavaScript代码向下编译成可以在当下可用(ES5)的版本

栗子
const square = n => n * n ,
const square = function(n){
  return n * n
}

如何使用?
babel-cli         命令行工具,转换生成新文件
babel-register 注册到node,require直接运行
babel-node              使用命令行直接运行
babel-core                编程方式转换代码

.babelrc
{"presets": ["es2015", "react"], "plugins": []},
npm install --save-dev babel-preset-react babel-preset-es2015

babel-polyfill
代码填充,兼容性补丁

babel-runtime
import _createClass from "babel-runtime/helpers/createClass"
npm i --save-dev babel-plugin-transform-runtime babel-runtime

语法检查
npm install --save-dev eslint babel-eslint

.eslintrc
{"parser": "babel-eslint", "rules": {}}
eslint assets/js/my-ecmascript6-file.js

编辑器支持
Atom / Web Storm / Sublime Text

完整依赖
babel-core / babel-eslint / babel-preset-es2015 / babel-preset-react

End
