const fs = require('fs')
const util = require('util')

const identity = x => () => x

const readdir = util.promisify(fs.readdir)
const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const access = util.promisify(fs.access)

const concat = (ys, x) => ys.concat(x)
const map = f => xs => xs.map(f)
const filter = f => xs => xs.filter(f)
const reduce = f => xs => xs.reduce(f)
const sort = f => xs => xs.sort(f)

const mapP = f => xs => Promise.all(xs.map(f))
const filterP = f => xs => Promise.all(xs.map(f)).then(ys => xs.filter((_, i) => ys[i]))


module.exports = {
  // Common
  identity,
  // Array
  map: map,
  filter: filter,
  reduce: reduce,
  sort: sort,
  concat: concat,
  // Promise
  mapP: mapP,
  filterP: filterP,
  // fs
  readdir: readdir,
  writeFile: writeFile,
  mkdir: mkdir,
  access: access,
}

