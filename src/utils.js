const fs = require('fs')
const util = require('util')

const identity = x => x
const constantly = x => () => x

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const access = util.promisify(fs.access)
const mkdir = util.promisify(fs.mkdir)
const rename = util.promisify(fs.rename)

const concat = (ys, x) => ys.concat(x)
const map = f => xs => xs.map(f)
const filter = f => xs => xs.filter(f)
const reduce = f => xs => xs.reduce(f)
const sort = f => xs => xs.sort(f)

const mapP = f => xs => Promise.all(xs.map(f))
const filterP = f => xs =>
  Promise.all(xs.map(f))
    .then(ys => xs.filter((_, i) => ys[i]))
    .catch(constantly(new Error(`'filterP' failed.`)))

module.exports = {
  // Common
  identity,
  constantly,
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
  readFile: readFile,
  writeFile: writeFile,
  access: access,
  mkdir: mkdir,
  rename: rename,
}
