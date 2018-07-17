const fs = require('fs')
const uitl = require('util')

const mkdir = util.promisify(fs.mkdir)
const mkdifile = util.promisify(fs.writeFile)

module.exports = (name, base) => {
}