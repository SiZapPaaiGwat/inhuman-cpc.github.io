Promise = require 'bluebird'
async = require 'async'
marked = require 'marked'
mustache = require 'mustache'
fs = require 'fs'
path = require 'path'

Promise.promisifyAll fs

postsPath = "#{__dirname}/../posts"
htmlPath = "#{__dirname}/../html"
concurrency = 5

pageTemplate = fs.readFileSync "#{__dirname}/template.html", "utf8"

# 新文件命名
renameFile = (filename) ->
	path.basename(filename, '.md') + ".html"

# 正文初始化
initHTML = (filename, mdOutput) ->
	pieces = filename.split("-")
	title =  pieces.slice(3).join(' ') + " @ " + pieces.slice(0, 3).join('-')
	mustache.render pageTemplate,
		title: title
		body: mdOutput
		stylesheets: ["../themes/darcula/index.css"]
		scripts: []

convert2HTML = (filename, next) ->
	filePath = postsPath + "/#{filename}"
	fs.readFileAsync(filePath, 'utf8').then (content) ->
		newPath = htmlPath + "/" + renameFile filename
		fs.writeFileAsync newPath, initHTML(filename, marked(content))
	.then next
	.catch (err) ->
		console.log "got an error when converting #{filename}"
		console.error err
		next()

fs.readdirAsync(postsPath).then (files) ->
	console.log "you have wrote #{files.length} articles via markdown."
	async.eachLimit files, concurrency, convert2HTML, (err) ->
		console.log "task finished."
.catch (err) ->
	console.log "oops, some error happened."
	throw err