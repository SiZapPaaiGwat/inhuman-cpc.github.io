/**
 * 网页正文提取
 * 确定一个参考页面
 * 第一步：基于布局相似提取目标页面的全部不同块级元素
 * 第二步：从结果集中筛选文本密度最大的两个元素计算最近公共祖先
 */
var parse5 = require('parse5')
var fs = require('fs')
var prettyFormat = require('pretty-format')
var newNode = parse5.parse(fs.readFileSync('./sample/target.html', 'utf8'))
var oldNode = parse5.parse(fs.readFileSync('./sample/base.html', 'utf8'))
var diffNodes = []
var excludeTags = 'svg,style,link,meta,iframe,noscript,footer,header'.split(',')
var inlineTags = 'b,big,i,small,tt,abbr,acronym,cite,code,dfn,em,kbd,strong,samp,time,var,a,bdo,br,img,map,object,q,span,sub,sup,button,input,label,select,textarea'.split(',')

// TODO 获取pre节点的文本（清楚所有标签）


function isExcludedNode(node) {
  if (!node) return true

  return excludeTags.indexOf(node.tagName) > -1 || node.nodeName === '#comment'
}

function hasDifferentAttr(target, old) {
  return false
}

function isDiffrentNode(target, old) {
  if (!target) return false

  if (!old) return true

  // 标签节点
  if (target.tagName) {
    return target.tagName !== old.tagName
  }

  // 文本节点
  if (target.nodeName) {
    return target.value !== old.value
  }

  // 属性不完全一致
  if (hasDifferentAttr(target, old)) {
    return true
  }

  console.log('unknown node')
  return false
}

function getParentBlockWrapper(node) {
  var wrapper = node.parentNode
  while (wrapper) {
    if (inlineTags.indexOf(wrapper.tagName) === -1) {
      return wrapper
    } else {
      wrapper = wrapper.parentNode
    }
  }

  return node
}

function isInlineNode(target) {
  return target.nodeName === '#text' || inlineTags.indexOf(target.tagName) > -1
}

function pushNode(target) {
  if (isInlineNode(target)) {
    var parent = getParentBlockWrapper(target)
    if (diffNodes.indexOf(parent) === -1) {
      diffNodes.push(parent)
    }
  } else {
    diffNodes.push(target)
  }
}

function diff(target, old) {
  if (isExcludedNode(target)) {
    return
  }

  if (isDiffrentNode(target, old)) {
    pushNode(target)
    return
  }

  if (!target.childNodes) return

  var oldChildNodes = old.childNodes || []
  target.childNodes.forEach((node, i) => {
    if (oldChildNodes[i]) {
      diff(node, oldChildNodes[i])
    } else {
      pushNode(node)
    }
  })
}

diff(newNode, oldNode)

var ret = ''
function render(item) {
  if (item.tagName) {
    ret += `<${item.tagName}>`
    item.childNodes.forEach(item => {
      render(item)
    })
    ret += `</${item.tagName}>\n`
  } else if (item.nodeName) {
    ret += `\n${item.value}\n`
  } else {
    console.log('unknown node')
  }
}

diffNodes.forEach(item => {
  render(item)
  console.log(item.tagName || item.nodeName, item.childNodes ? item.childNodes.length : item.value)
})

console.log(diffNodes.length)

fs.writeFileSync('./out', ret)
