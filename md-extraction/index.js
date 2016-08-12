/**
 * 将网页内容转换为markdown
 */
var toMarkdown = require('to-markdown')
var request = require('superagent')
var parseDOM = require('./DOMParser')
var extract = require('./Extractor').extract

require('superagent-proxy')(request)

function loadUrlContent(url) {
  return new Promise((resolve, reject) => {
    request.get(url).proxy('socks://127.0.0.1:1080').end((err, res) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res.text)
    })
  })
}

var urlList = [
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path?hl=zh-cn',
  'https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations?hl=zh-cn'
]

loadUrlContent(urlList[0]).then(text => {
  var node = extract(parseDOM(text))
  console.log(node.name)
  console.log(node.attribs)
}).catch(err => {
  console.log(err.stack)
})
