function getMarkdownTitle(text = '') {
  var HEADING_REG = /^ *# +[^\n]*\n*/g
  var matched = text.trim().match(HEADING_REG)
  if (matched) {
    return matched[0].replace(/^ *# +/g, '')
  }

  return null
}

function loadContent(url) {
  fetch(url).then(res => {
    return res.text()
  }).then(text => {
    document.title = getMarkdownTitle(text)
    document.querySelector('#content').innerHTML = marked(text, {gfm: true})
  })
}

function executeScript(url) {
  var script = document.createElement('script')
  script.src = url
  script.type = 'text/babel'
  document.body.appendChild(script)
}

void function() {
  var pagename = location.search.slice(1) || 'shape'
  loadContent('./' + pagename + '.md')
  executeScript('../js/' + pagename + '.js')
}()
