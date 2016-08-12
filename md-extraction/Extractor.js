var ignoreTags = 'script,link,meta,title,noscript,iframe'.split(',')

function isLegalMarkdownNode(tagName) {
  return tagName && ignoreTags.indexOf(tagName) === -1
}

function dfs(node) {
	var dequeIn = [node]

	while (dequeIn.length) {
		var item = dequeIn.pop()
		var children = item.children || []
		var len = children.length
		for (var i = 0; i < len; i += 1) {
			dequeIn.push(children[len - 1 - i])
		}
	}

}

exports.extract = extract
