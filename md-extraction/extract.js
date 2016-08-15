/**
 * 网页正文提取
 * 确定一个参考页面
 * 第一步：基于布局相似提取目标页面的全部不同块级元素
 * 第二步：从结果集中筛选文本密度最大的两个元素计算最近公共祖先
 */

var utils = require('./utils')

module.exports = function extact(targetNode, baseNode) {
  var diffNodes = []

  function pushNode(target) {
    if (utils.isInlineNode(target)) {
      var parent = utils.getLowestContainer(target)
      if (diffNodes.indexOf(parent) === -1) {
        diffNodes.push(parent)
      }
    } else {
      diffNodes.push(target)
    }
  }

  function diff(target, old) {
    if (utils.isExcludedNode(target)) {
      return
    }

    if (utils.isDiffrentNode(target, old)) {
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

  diff(targetNode, baseNode)

  diffNodes.forEach(item => {
    item.__length = utils.getNodeText(item).length
  })

  diffNodes.sort((a, b) => {
    return b.__length - a.__length
  })

  if (diffNodes.length > 1) {
    return utils.getLowestCommonAncestor(diffNodes[0], diffNodes[1])
  } else if (diffNodes.length === 1) {
    return diffNodes[0]
  } else {
    console.error('Unable to extract page content')
    return null
  }
}
