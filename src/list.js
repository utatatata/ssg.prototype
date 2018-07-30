const moment = require('moment')

const pdu = require('./postDraftUtils')

module.exports = async config => {
  try {
    const [splitedDraftPathList, splitedPostPathList] = await Promise.all([
      pdu.readDrafts(config.draftsDir),
      pdu.readPosts(config.postsDir),
    ])

    const sortedSplitedPostPathList = splitedPostPathList.sort(
      (splitedPath1, splitedPath2) => {
        const [, y1, m1, d1] = splitedPath1
        const [, y2, m2, d2] = splitedPath2
        return moment(y1, m1, d1).valueOf() < moment(y2, m2, d2).valueOf()
      }
    )

    console.log('Drafts:')
    splitedDraftPathList.forEach(splitedPath => {
      const [, name] = splitedPath
      console.log(name)
    })

    console.log()

    console.log('Posts:')
    sortedSplitedPostPathList.forEach(splitedPath => {
      const [, year, month, date, name] = splitedPath
      console.log(name, `(${year}-${month}-${date})`)
    })
  } catch (e) {
    console.log(`The command 'list' failed with error:`)
    console.log()
    console.log(e)
  }
}
