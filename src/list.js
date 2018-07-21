const moment = require('moment')

const u = require('./utils')
const fsu = require('./fsUtils')

module.exports = async config => {
  try {
    const [drafts, posts] = await Promise.all([
      fsu.readDrafts(config.draftsDir),
      fsu.readPosts(config.postsDir),
    ])

    const sortedPosts = Array.isArray(posts)
      ? posts.sort((splitedPath1, splitedPath2) => {
          const [, y1, m1, d1] = splitedPath1
          const [, y2, m2, d2] = splitedPath2
          return moment(y1, m1, d1).valueOf < moment(y2, m2, d2).valueOf
        })
      : []

    console.log('Drafts:')
    drafts.forEach(draft => {
      console.log(draft)
    })

    console.log()

    console.log('Posts:')
    sortedPosts.forEach(splitedPath => {
      const [, , , , post] = splitedPath
      console.log(post)
    })
  } catch (e) {
    console.log(e)
    console.log(
      `The directory '${config.draftsDir}' or '${
        config.postsDir
      }' doesn't exist.`
    )
  }
}
