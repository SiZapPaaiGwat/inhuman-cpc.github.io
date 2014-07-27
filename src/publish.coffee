Promise = require 'bluebird'
async = require 'async'
marked = require 'marked'
mustache = require 'mustache'
fs = require 'fs'
path = require 'path'

Promise.promisifyAll fs

postsPath = "#{__dirname}/../posts"
htmlPath = "#{__dirname}/../html"
indexPath = "#{__dirname}/../index.html"
concurrency = 5

pageTemplate = fs.readFileSync "#{__dirname}/template.html", "utf8"
indexTemplate = fs.readFileSync "#{__dirname}/index_template.html", "utf8"

# 新文件命名
renameFile = (filename) ->
	path.basename(filename, '.md') + ".html"

parseFile = (filename) ->
	pieces = filename.split("-")
	title: pieces.slice(3).join(' ')
	time: pieces.slice(0, 3).join('-')
	filename: renameFile filename

# 正文初始化
initHTML = (filename, mdOutput) ->
	fileInfo = parseFile filename
	mustache.render pageTemplate,
		title: fileInfo.title + " @ " + fileInfo.time
		body: mdOutput
		stylesheets: ["../themes/darcula/index.css"]
		scripts: []

# 将markdown文件转换为html
convert2HTML = (filename, next) ->
	console.log "converting #{filename} ..."
	filePath = postsPath + "/#{filename}"
	fs.readFileAsync(filePath, 'utf8').then (content) ->
		newPath = htmlPath + "/" + renameFile filename
		fs.writeFileAsync newPath, initHTML(filename, marked(content))
	.then next
	.catch (err) ->
		console.log "got an error when converting #{filename}"
		console.error err
		next()

# 生成index页面
# TODO 根据日期倒叙排列
generateIndexPage = (files) ->
	mustache.render indexTemplate,
		title: "Simon Xu's Blog"
		items: files.map(parseFile).reverse()
		stylesheets: ["./themes/darcula/index.css"]
		scripts: []

fs.readdirAsync(postsPath).then (files) ->
	console.log "you have wrote #{files.length} articles via markdown."

	new Promise (resolve, reject) ->
		async.eachLimit files, concurrency, convert2HTML, (err) ->
			if err then return reject err
			resolve files
.then (files)->
	fs.writeFileAsync indexPath, generateIndexPage(files)

	console.log "congrats, your blog has been updated."
.catch (err) ->
	console.log "oops, some error happened."
	console.log err