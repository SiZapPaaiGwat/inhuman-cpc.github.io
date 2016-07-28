function getMarkdownTitle(text = '') {
  let HEADING_REG = /^ *# +[^\n]*\n*/g
  let matched = text.trim().match(HEADING_REG)
  if (matched) {
    return matched[0].replace(/^ *# +/g, '')
  }

  return null
}

function executeScript(content) {
  let script = document.createElement('script')
  script.textContent = content
  document.body.appendChild(script)
}

void function() {
  let pagename = location.search.slice(1) || 'line-with-missing-data'
  let mdUrl = './' + pagename + '.md'
  let scriptUrl = '../js/' + pagename + '.js'
  Promise.all([
    fetch(mdUrl),
    fetch(scriptUrl)
  ]).then(result => {
    return Promise.all([
      result[0].text(),
      result[1].text()
    ])
  }).then(result => {
    executeScript(Babel.transform(result[1], {presets: ['es2015', 'react']}).code)
    document.title = getMarkdownTitle(result[0])

    let mdContent = `${result[0]}\n## 源码\n\`\`\`ks\n${result[1]}\n\`\`\``
    document.querySelector('#content').innerHTML = marked(mdContent, {gfm: true})
  })
}()
