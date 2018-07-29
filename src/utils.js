const fs = require('fs')
const path = require('path')
const util = require('util')

const identity = x => x
const constantly = x => () => x

const map = f => xs => xs.map(f)
const filter = f => xs => xs.filter(f)
const reduce = f => xs => (xs.length === 0 ? [] : xs.reduce(f, []))
const sort = f => xs => xs.sort(f)
const concat = (ys, x) => ys.concat(x)
const range = (start, end, step = 1) => {
  // range(end)
  if (typeof end === 'undefined') {
    end = start
    start = 0
    step = 1
  }
  const actualStep = end - start >= 0 ? step : -step
  const length = Math.ceil((Math.abs(end - start) + 1) / step)
  return [...Array(length)].map((_, i) => start + i * actualStep)
}

const mapP = f => xs => Promise.all(xs.map(f))
const filterP = predicate => async xs => {
  const satisfiedList = await mapP(predicate)(xs)
  return xs.filter((_, i) => satisfiedList[i])
}

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const access = util.promisify(fs.access)
const mkdir = util.promisify(fs.mkdir)
const rename = util.promisify(fs.rename)
const stat = util.promisify(fs.stat)

const mkdirp = async anyPath => {
  const splitedPath = path.resolve(anyPath).split(path.sep)
  let currentPath = '/'
  for (const piece of splitedPath) {
    currentPath = path.resolve(currentPath, piece)
    await mkdir(currentPath).catch(identity)
  }
}

const readdirRecursively = async (anyPath, depth = -1) => {
  let clearSplitedPathList = []
  let unsearchedSplitedPathList = []

  {
    const base = path.resolve(anyPath)
    clearSplitedPathList.push([base])

    const stats = await stat(base)
    if (stats.isDirectory()) {
      unsearchedSplitedPathList.push([base])
    }
  }

  for (let currentDepth = 0; currentDepth !== depth; currentDepth++) {
    if (unsearchedSplitedPathList.length === 0) {
      break
    }

    const directoryObjList = await Promise.all(
      unsearchedSplitedPathList.map(async splitedPath => {
        const dirList = await readdir(path.resolve(...splitedPath))
        const splitedPathList = dirList.map(dir => splitedPath.concat(dir))

        const splitedDirectoryPathList = await filterP(async splitedPath => {
          const stats = await stat(path.resolve(...splitedPath))
          return stats.isDirectory()
        })(splitedPathList)

        return {
          splitedPathList,
          splitedDirectoryPathList,
        }
      })
    )

    unsearchedSplitedPathList = []

    directoryObjList.forEach(directoryObj => {
      clearSplitedPathList.push(...directoryObj.splitedPathList)
      unsearchedSplitedPathList.push(...directoryObj.splitedDirectoryPathList)
    })
  }

  return clearSplitedPathList
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
  range,
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
  stat,
  mkdirp,
  readdirRecursively,
}
