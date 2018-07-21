const path = require('path')

const u = require('./utils')

const readDrafts = async dir => {
  const splitedDraftPathList = (await u.readdir(dir)).map(draft => [dir, draft])

  const splitedDocumentPathList = u.filterP(splitedPath =>
    u
      .access(path.resolve(...splitedPath))
      .then(u.constantly(true))
      .catch(u.constantly(false))
  )(
    splitedDraftPathList.map(splitedPath =>
      splitedPath.concat('index.asciidoc')
    )
  )

  return splitedDocumentPathList
}

const readPosts = async dir => {
  const splitedYearPathList = (await u.readdir(dir))
    .filter(year => year.match(/^\d+$/))
    .map(year => [dir, year])

  const splitedMonthPathList = (await Promise.all(
    splitedYearPathList.map(async splitedPath => {
      const monthDirList = await u.readdir(path.resolve(...splitedPath))
      return monthDirList
        .filter(month => month.match(/^0[1-9]|1[0-2]$/))
        .map(month => splitedPath.concat(month))
    })
  )).reduce(u.concat, [])

  const splitedDatePathList = (await Promise.all(
    splitedMonthPathList.map(async splitedPath => {
      const dateDirList = await u.readdir(path.resolve(...splitedPath))
      return dateDirList
        .filter(date => date.match(/^0[1-9]|[1-2][0-9]|3[01]$/))
        .map(date => splitedPath.concat(date))
    })
  )).reduce(u.concat, [])

  const splitedPostPathList = (await Promise.all(
    splitedDatePathList.map(async splitedPath => {
      const postDirList = await u.readdir(path.resolve(...splitedPath))
      return postDirList.map(post => splitedPath.concat(post))
    })
  )).reduce(u.concat, [])

  const splitedDocumentPathList = u.filterP(splitedPath =>
    u
      .access(path.resolve(...splitedPath))
      .then(u.constantly(true))
      .catch(u.constantly(false))
  )(
    splitedPostPathList.map(splitedPath => splitedPath.concat('index.asciidoc'))
  )

  return splitedDocumentPathList
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
