const fs = require('fs')
const path = require('path')
const util = require('util')

const identity = x => x
const constantly = x => () => x

const concat = (ys, x) => ys.concat(x)
const map = f => xs => xs.map(f)
const filter = f => xs => xs.filter(f)
const reduce = f => xs => (xs.length === 0 ? [] : xs.reduce(f))
const sort = f => xs => xs.sort(f)

const mapP = f => xs => Promise.all(xs.map(f))
const filterP = f => xs =>
  Promise.all(xs.map(f))
    .then(ys => xs.filter((_, i) => ys[i]))
    .catch(constantly(new Error(`'filterP' failed.`)))

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const access = util.promisify(fs.access)
const mkdir = util.promisify(fs.mkdir)
const rename = util.promisify(fs.rename)

const mkdirp = async anyPath => {
  const splitedPath = path.resolve(anyPath).split(path.sep)
  let currentPath = '/'
  for (const piece of splitedPath) {
    currentPath = path.resolve(currentPath, piece)
    await mkdir(currentPath).catch(identity)
  }
}

module.exports = {
  // Common
  identity,
  constantly,
  // Array
  map,
  filter,
  reduce,
  sort,
  concat,
  // Promise
  mapP,
  filterP,
  // fs
  readdir,
  readFile,
  writeFile,
  access,
  mkdir,
  rename,
  mkdirp,
}
