var parse5 = require('parse5')
var fs = require('fs')
var prettyFormat = require('pretty-format')
var data = require('./data')
var newNode = parse5.parse(data.targetHTML)
var oldNode = parse5.parse(data.baseHTML)
var diffNodes = []
var excludeTags = 'svg,style,link,meta,iframe,noscript'.split(',')

function hasDifferentAttr(target, old) {
  return false
}

function isDiffrentNode(target, old = {}) {
  if (!target) return false

  if (excludeTags.indexOf(target.tagName) > -1) {
    return false
  }

  if (target.parentNode) {
    if (excludeTags.indexOf(target.parentNode.tagName) > -1) {
      return false
    }
  }

  if (hasDifferentAttr(target, old)) {
    return true
  }

  if (target.tagName) {
    return target.tagName !== old.tagName
  }

  if (target.nodeName) {
    return target.value !== old.value
  }

  console.log('unknown node')
  return false
}

function diff(target, old) {
  if (!target) return

  if (isDiffrentNode(target, old)) {
    diffNodes.push(target)
    return
  }

  if (!target.childNodes) return

  var oldChildNodes = old.childNodes || []
  target.childNodes.forEach((node, i) => {
    diff(node, oldChildNodes[i])
  })
}

diff(newNode, oldNode)


function print(item) {
  if (excludeTags.indexOf(item.tagName) === -1 ) {
    console.log('****')
    console.log(`nodeName: ${item.nodeName}`)
    console.log(`nodeValue: ${item.value}`)
    console.log(`tagName: ${item.tagName}`)
  }

  if (item.childNodes && item.childNodes.length) {
    item.childNodes.forEach(i => {
      print(i)
    })
  }
}

// diffNodes.forEach(i => {
//   print(i)
// })

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
})



fs.writeFileSync('./out', ret)
