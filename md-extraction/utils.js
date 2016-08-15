/**
 * 如下标签与网页正文内容关联很小
 * 对比节点差异时直接忽略
 */
var excludeTags = 'svg,style,link,meta,iframe,noscript,footer,header'.split(',')

/**
 * 如下内联元素可能作为网页正文的修复标签出现
 */
var inlineTags = 'b,big,i,small,tt,abbr,acronym,cite,code,dfn,em,kbd,strong,samp,time,var,a,bdo,br,img,map,object,q,span,sub,sup,button,input,label,select,textarea'.split(',')

/**
 * 是否为文本节点
 */
function isTextNode(node) {
  return node && node.nodeName === '#text'
}

/**
 * 是否为注释节点
 */
function isCommnetNode(node) {
  return node && node.nodeName === '#comment'
}

/**
 * 获取节点的innerText
 * TODO pre/code标签比较特殊可能包含格式化的标签元素
 * markdown转化的时候需要清楚这些标签获取文本
 */
function getNodeText(node) {
  if (isTextNode(node)) {
    return node.value
  }

  var textFragment = []

  function traverse(el) {
    if (isCommnetNode(el)) return

    el.childNodes.forEach(item => {
      if (isTextNode(item)) {
        textFragment.push(item.value)
      } else {
        traverse(item)
      }
    })
  }

  traverse(node)

  return textFragment.join(' ')
}

/**
 * 获取节点路径上的所有节点（自身和所有父节点）
 */
function getNodePathList(node) {
  var parents = [node]
  var parent = node.parentNode
  while (parent) {
    parents.unshift(parent)
    parent = parent.parentNode
  }

  return parents
}

/**
 * 获取最近的公共祖先
 */
function getLowestCommonAncestor(nodeA, nodeB) {
  var paList = getNodePathList(nodeA)
  var pbList = getNodePathList(nodeB)
  var len = Math.min(paList.length, pbList.length)
  for (var i = len - 1; i >= 0 ; i -= 1) {
    if (paList[i] === pbList[i]) {
      return paList[i]
    }
  }
}

/**
 * 对比节点差异时，是否需要排除此此节点
 * 如果节点不存在或者与正文内容无关则需要排除
 */
function isExcludedNode(node) {
  return node && (excludeTags.indexOf(node.tagName) > -1 || node.nodeName === '#comment')
}

/**
 * 是否拥有不同的节点属性
 * TODO
 */
function hasDifferentAttr(target, old) {
  return false
}

/**
 * 是否为不同节点，判断标准：
 * 1) 标签元素，标签名不同或者属性不一致
 * 2) 文本元素，判断内容是否一致（注释节点忽略）
 */
function isDiffrentNode(target, old) {
  if (!target || isCommnetNode(target)) {
    return false
  }

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

  // 注释节点
  return false
}

/**
 * 获取节点最近的父级容器节点
 */
function getLowestContainer(node) {
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

/**
 * 是否为内联节点：文本节点和内联元素
 */
function isInlineNode(target) {
  return target.nodeName === '#text' || inlineTags.indexOf(target.tagName) > -1
}

exports.isTextNode = isTextNode
exports.isCommnetNode = isCommnetNode
exports.getNodeText = getNodeText
exports.getNodePathList = getNodePathList
exports.getLowestCommonAncestor = getLowestCommonAncestor
exports.isExcludedNode = isExcludedNode
exports.hasDifferentAttr = hasDifferentAttr
exports.isDiffrentNode = isDiffrentNode
exports.getLowestContainer = getLowestContainer
exports.isInlineNode = isInlineNode
