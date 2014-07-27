Promise = require 'bluebird'
async = require 'async'
marked = require 'marked'
mustache = require 'mustache'
fs = require 'fs'
path = require 'path'
config = require '../config'

Promise.promisifyAll fs

basePath = "#{__dirname}/../"
postsPath = basePath + config.posts_path
htmlPath = basePath + config.html_output_path
indexPath = basePath + config.index_page_path
pageTemplate = fs.readFileSync basePath + config.post_template, "utf8"
indexTemplate = fs.readFileSync basePath + config.index_page_template, "utf8"
theme = config.default_theme
concurrency = config.concurrency or 5

# rename output html files from markdown files
renameHTMLFile = (filename) ->
	path.basename(filename, '.md') + ".html"

# parse information from markdown files
parseMarkdownFile = (filename) ->
	pieces = filename.split("-")
	title: pieces.slice(3).join(' ')
	time: pieces.slice(0, 3).join('-')
	filename: renameHTMLFile filename

# init html content from markdown content
initHTML = (filename, mdOutput) ->
	fileInfo = parseMarkdownFile filename
	mustache.render pageTemplate,
		title: fileInfo.title + " @ " + fileInfo.time
		body: mdOutput
		stylesheets: ["../themes/#{theme}/index.css"]
		scripts: []

# convert markdown files to html files
convert2HTML = (filename, next) ->
	console.log "converting #{filename} ..."
	filePath = postsPath + "/#{filename}"
	fs.readFileAsync(filePath, 'utf8').then (content) ->
		newPath = htmlPath + "/" + renameHTMLFile filename
		fs.writeFileAsync newPath, initHTML(filename, marked(content))
	.then next
	.catch (err) ->
		console.log "got an error when converting #{filename}"
		console.error err
		next()

# build blog home page
generateIndexPage = (files) ->
	mustache.render indexTemplate,
		title: config.site_name
		items: files.map(parseMarkdownFile).reverse()
		stylesheets: ["./themes/#{theme}/index.css"].concat config.stylesheets
		scripts: [].concat config.scripts

# start building blog
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