const fs = require('fs')
const {
  promisify
} = require('util')
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      // 把文件全部读取完成后才显示，性能不高
      // fs.readFile(filePath, (err, data) => {
      //   res.end(data)
      // })
      // 流媒体 读取多少显示多少 性能好
      fs.createReadStream(filePath).pipe(res)
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end(files.join(','))
    }
  } catch (ex) {
    console.error(ex)
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${filePath} is not a directory or file\n ${ex}`)
  }
}
