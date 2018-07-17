const path = require('path')

const u = require('./utils')


const parseBase = base => path.basename(path.resolve(base))

const readPosts = base => {
  base = parseBase(base)

  return u.readdir(path.resolve(base))
    .then(u.filter(year => year.match(/^\d+$/)))
    .then(u.map(year => [base, year]))
    .then(u.mapP(splitedPath => u.readdir(path.resolve(...splitedPath))
      .then(u.filter(month => month.match(/^0[1-9]|1[0-2]$/)))
      .then(u.map(month => splitedPath.concat(month)))
    ))
    .then(u.reduce(u.concat))
    .then(u.mapP(splitedPath => u.readdir(path.resolve(...splitedPath))
      .then(u.filter(day => day.match(/^0[1-9]|[1-2][0-9]|3[01]$/)))
      .then(u.map(day => splitedPath.concat(day)))
    ))
    .then(u.reduce(u.concat))
    .then(u.mapP(splitedPath => u.readdir(path.resolve(...splitedPath))
      .then(u.map(post => splitedPath.concat(post)))
    ))
    .then(u.reduce(u.concat))
    .then(u.filterP(splitedPath => u.access(path.resolve(...splitedPath, 'index.asciidoc'))
      .then(u.identity(true))
      .catch(u.identity(false))
    ))
}

const readDrafts = base => {
  base = parseBase(base)

  return u.readdir(path.resolve(base))
    .then(u.filterP(draft => u.access(path.resolve(base, draft, 'index.asciidoc'))
      .then(u.identity(true))
      .catch(u.identity(false))
    ))
}


module.exports = {
  readPosts,
  readDrafts,
}
