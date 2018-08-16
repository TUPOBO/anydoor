const http = require('http')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const conf = require('./config/defaultConfig')

const server = http.createServer((req, res) => {
  const url = req.url
  const filePath = path.join(conf.root, url)
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.end(`${filePath} is not a directory or file`)
    } else if (stats.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      // 把文件全部读取完成后才显示，性能不高
      // fs.readFile(filePath, (err, data) => {
      //   res.end(data)
      // })
      // 流媒体 读取多少显示多少 性能好
      fs.createReadStream(filePath, {encoding: 'utf8'}).pipe(res)
    } else if (stats.isDirectory()) {
      fs.readdir(filePath, (error, files) => {
        if (error) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain')
          res.end(`Can not read ${filePath}`)
        } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end(files.join(','))
        }
      })
    }
  })
})

server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`
  console.info(`Server started at ${chalk.green(addr)}`)
})
