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

const draftDir = (name, draftsDir) => path.resolve(draftsDir, name)
const draftDocumentPath = (name, draftsDir) =>
  path.join(draftDir(name, draftsDir), 'index.asciidoc')
const draftRelativeDir = (name, draftsDir, rootDir) =>
  path.relative(rootDir, draftDir(name, draftsDir))
const draftRelativeDocumentPath = (name, draftsDir, rootDir) =>
  path.relative(rootDir, draftDocumentPath(name, draftsDir))

const draftPaths = (name, draftsDir, rootDir) => {
  const dir = draftDir(name, draftsDir)
  const documentPath = draftDocumentPath(name, drafts)
  const relativeDir = draftRelativeDir(name, drafts, rootDir)
  const relativeDocumentPath = draftRelativeDocumentPath(
    name,
    draftsDir,
    rootDir
  )
  return {
    dir,
    documentPath,
    relativeDir,
    relativeDocumentPath,
  }
}

const postDir = (name, postsDir, year, month, date) =>
  path.resolve(postsDir, year, month, date, name)
const postDocumentPath = (name, postsDir, year, month, date) =>
  path.join(postDir(name, postsDir, year, month, date), 'index.asciidoc')
const postRelativeDir = (name, postsDir, rootDir, year, month, date) =>
  path.relative(rootDir, postDir(name, postsDir, year, month, date))
const postRelativeDocumentPath = (name, postsDir, rootDir, year, month, date) =>
  path.relative(rootDir, postDocumentPath(name, postsDir, year, month, date))

const postPaths = (name, postsDir, rootDir, year, month, date) => {
  const dir = postDir(name, postsDir, year, month, date)
  const documentPath = postDocumentPath(name, postsDir, year, month, date)
  const relativeDir = postRelativeDir(
    name,
    postsDir,
    rootDir,
    year,
    month,
    date
  )
  const relativeDocumentPath = postRelativeDocumentPath(
    name,
    postsDir,
    rootDir,
    year,
    month,
    date
  )
  return {
    dir,
    documentPath,
    relativeDir,
    relativeDocumentPath,
  }
}

module.exports = {
  readDrafts,
  readPosts,
  existFromDrafts,
  existFromPosts,
  exist,
  draftDir,
  draftDocumentPath,
  draftRelativeDir,
  draftRelativeDocumentPath,
  draftPaths,
  postDir,
  postDocumentPath,
  postRelativeDir,
  postRelativeDocumentPath,
  postPaths,
}
