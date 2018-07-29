const path = require('path')
const moment = require('moment')

const pdu = require('./PostDraftUtils')

module.exports = async config => {
  try {
    const [drafts, posts] = await Promise.all([
      pdu.readDrafts(config.draftsDir),
      pdu.readPosts(config.postsDir),
    ])

    const sortedPosts = Array.isArray(posts)
      ? posts.sort((splitedPath1, splitedPath2) => {
          const [, y1, m1, d1] = splitedPath1
          const [, y2, m2, d2] = splitedPath2
          return moment(y1, m1, d1).valueOf < moment(y2, m2, d2).valueOf
        })
      : []

    console.log('Drafts:')
    drafts.forEach(splitedPath => {
      const name = path.basename(path.dirname(path.resolve(...splitedPath)))
      console.log(name)
    })

    console.log()

    console.log('Posts:')
    sortedPosts.forEach(splitedPath => {
      const name = path.basename(path.dirname(path.resolve(...splitedPath)))
      console.log(name)
    })
  } catch (e) {
    console.log(`The command 'list' failed with error:`)
    console.log()
    console.log(e)
  }
}
