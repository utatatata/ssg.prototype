const moment = require('moment')

const u = require('./utils')
const fsu = require('./fsUtils')

module.exports = (draftsBase, postsBase) => {
  Promise.all([fsu.readDrafts(draftsBase), fsu.readPosts(postsBase)])
    .then(result => {
      const [drafts, posts] = result
      return {
        drafts: drafts,
        posts: posts.sort((splitedPath1, splitedPath2) => {
          const [, y1, m1, d1] = splitedPath1
          const [, y2, m2, d2] = splitedPath2
          return moment(y1, m1, d1).valueOf < moment(y2, m2, d2).valueOf
        }),
      }
    })
    .then(result => {
      console.log('Drafts:')
      result.drafts.map(draft => {
        console.log(draft)
      })

      console.log()

      console.log('Posts:')
      result.posts.map(splitedPath => {
        const [, , , , post] = splitedPath
        console.log(post)
      })
    })
}
