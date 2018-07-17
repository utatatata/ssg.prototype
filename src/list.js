const moment = require('moment')

const u = require('./utils')
const fsu = require('./fsUtils')

module.exports = (draftsBase, postsBase) => {
  fsu.readDrafts(draftsBase).then(
    splitedPathList =>
      console.log('Drafts:') ||
      u.map(draft => {
        console.log(draft)
      })(splitedPathList)
  )

  console.log()

  fsu
    .readPosts(postsBase)
    .then(
      u.sort((splitedPath1, splitedPath2) => {
        const [, y1, m1, d1] = splitedPath1
        const [, y2, m2, d2] = splitedPath2
        return moment(y1, m1, d1) < moment(y2, m2, d2)
      })
    )
    .then(
      splitedPathList =>
        console.log('\nPosts:') ||
        u.map(splitedPath => {
          const [, , , , post] = splitedPath
          console.log(post)
        })(splitedPathList)
    )
}
