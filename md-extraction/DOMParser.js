var htmlparser = require('htmlparser2')

module.exports = function parse(html) {
  var handler = new htmlparser.DomHandler()
  var parser = new htmlparser.Parser(handler)
  parser.parseComplete(html)
  return handler.dom
}
