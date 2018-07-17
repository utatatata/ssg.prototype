const path = require('path')

const u = require('./utils')

const parseDir = dir => path.basename(path.resolve(dir))

const readPosts = dir => {
  dir = parseDir(dir)

  return u
    .readdir(path.resolve(dir))
    .then(u.filter(year => year.match(/^\d+$/)))
    .then(u.map(year => [dir, year]))
    .then(
      u.mapP(splitedPath =>
        u
          .readdir(path.resolve(...splitedPath))
          .then(u.filter(month => month.match(/^0[1-9]|1[0-2]$/)))
          .then(u.map(month => splitedPath.concat(month)))
          .catch(
            u.constantly(
              new Error(
                `The directory '${path.resolve(...splitedPath)}' doesn't exist.`
              )
            )
          )
      )
    )
    .then(u.reduce(u.concat))
    .then(
      u.mapP(splitedPath =>
        u
          .readdir(path.resolve(...splitedPath))
          .then(u.filter(date => date.match(/^0[1-9]|[1-2][0-9]|3[01]$/)))
          .then(u.map(date => splitedPath.concat(date)))
          .catch(
            u.constantly(
              new Error(
                `The directory '${path.resolve(...splitedPath)}' doesn't exist.`
              )
            )
          )
      )
    )
    .then(u.reduce(u.concat))
    .then(
      u.mapP(splitedPath =>
        u
          .readdir(path.resolve(...splitedPath))
          .then(u.map(post => splitedPath.concat(post)))
          .catch(
            u.constantly(
              new Error(
                `The directory '${path.resolve(...splitedPath)}' doesn't exist.`
              )
            )
          )
      )
    )
    .then(u.reduce(u.concat))
    .then(
      u.filterP(splitedPath =>
        u
          .access(path.resolve(...splitedPath, 'index.asciidoc'))
          .then(u.constantly(true))
          .catch(u.constantly(false))
      )
    )
    .catch(u.constantly(new Error(`The directory '${dir}' doesn't exist.`)))
}

const readDrafts = dir => {
  dir = parseDir(dir)

  return u
    .readdir(path.resolve(dir))
    .then(
      u.filterP(draft =>
        u
          .access(path.resolve(dir, draft, 'index.asciidoc'))
          .then(u.constantly(true))
          .catch(u.constantly(false))
      )
    )
    .catch(u.constantly(new Error(`The directory '${dir}' doesn't exist.`)))
}

const existFromDrafts = (name, dir) => {
  dir = parseDir(dir)

  return readDrafts(dir).then(u.filterP(draft => draft === name))
}

const existFromPosts = (name, dir) => {
  dir = parseDir(dir)

  return readPosts(dir).then(
    u.filterP(splitedPath => {
      const [, , , , post] = splitedPath
      return post === name
    })
  )
}

const exist = (name, draftsDir, postsDir) => {
  draftsDir = parseDir(draftsDir)
  postsDir = parseDir(postsDir)

  return Promise.all([
    existFromDrafts(name, draftsDir),
    existFromPosts(name, postsDir),
  ])
    .then(result => {
      const [drafts, posts] = result
      return {
        drafts: drafts,
        posts: posts,
      }
    })
    .catch(
      u.constantly(
        new Error(
          `The directory '${draftsDir}' or '${postsDir}' doesn't exist.`
        )
      )
    )
}

module.exports = {
  readPosts,
  readDrafts,
  existFromDrafts,
  existFromPosts,
  exist,
}
