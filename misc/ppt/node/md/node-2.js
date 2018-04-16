const http = require('http')
const https = require('https')

function get (url, callback) {
  const httpx = url.indexOf('https') === 0 ? https : http
  httpx.get(url, (res) => {
    const { statusCode } = res
    const contentType = res.headers['content-type']

    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk })
    res.on('end', () => {
      callback(null, rawData)
    })
  }).on('error', (error) => {
    callback(error)
  })
}

const callback = function (err, html) {
  console.log(html)
}
const callbackWithErrorHandler = function (err, html) {
  if (err) {
    console.error(err)
    return
  }

  console.log(html)
}

get('https://www.toutiao.com/a6544565147048870408/', callback)

get('http://new.qq.com/omn/20180415A0VN1X00', callback)

// get('http://new.qq1xxxx.com/omn/20180415A0VN1X00111', callbackWithErrorHandler)

module.exports = get
