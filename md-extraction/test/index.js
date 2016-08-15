var fs = require('fs')
var parse5 = require('parse5')
var extract = require('../extract')
var targetNode = parse5.parse(fs.readFileSync('../sample/target.html', 'utf8'))
var baseNode = parse5.parse(fs.readFileSync('../sample/base.html', 'utf8'))

console.log(extract(targetNode, baseNode))
