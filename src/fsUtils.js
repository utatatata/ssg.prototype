const path = require('path')

const u = require('./utils')

const readDrafts = async anyPath => {
  const splitedPathList = await u.readdirRecursively(anyPath, 2)
  return splitedPathList.filter(splitedPath => {
    const [draftsDir, draftName, document] = splitedPath
    return document === 'index.asciidoc'
  })
}

const readPosts = async anyPath => {
  const splitedPathList = await u.readdirRecursively(anyPath, 5)
  return splitedPathList.filter(splitedPath => {
    const [postsDir, year, month, date, postName, document] = splitedPath
    return (
      year &&
      year.match(/^\d+$/) &&
      month &&
      month.match(/^0[1-9]|1[0-2]$/) &&
      date &&
      date.match(/^0[1-9]|[1-2][0-9]|3[01]$/) &&
      document === 'index.asciidoc'
    )
  })
}

const existFromDrafts = async (name, dir) => {
  const drafts = await readDrafts(dir)
  const result = drafts.filter(splitedPath => {
    const draftName = path.basename(path.dirname(path.resolve(...splitedPath)))
    return draftName === name
  })
  return result
}

const existFromPosts = async (name, dir) => {
  const posts = await readPosts(dir)
  return posts.filter(splitedPath => {
    const postName = path.basename(path.dirname(path.resolve(...splitedPath)))
    return postName === name
  })
}

const exist = async (name, draftsDir, postsDir) => {
  const [drafts, posts] = await Promise.all([
    existFromDrafts(name, draftsDir),
    existFromPosts(name, postsDir),
  ])
  return {
    drafts,
    posts,
  }
}

module.exports = {
  readPosts,
  readDrafts,
  existFromDrafts,
  existFromPosts,
  exist,
}
