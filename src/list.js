const moment = require('moment')

const u = require('./utils')
const au = require('./asciidocUtils')
const pdu = require('./postDraftUtils')

module.exports = async config => {
  try {
    const [splitedDraftPathList, splitedPostPathList] = await Promise.all([
      pdu.readDrafts(config.draftsDir),
      pdu.readPosts(config.postsDir),
    ])

    const sortedSplitedPostPathList = splitedPostPathList.sort(
      async (splitedPath1, splitedPath2) => {
        const [, y1, m1, d1, name1] = splitedPath1
        const [, y2, m2, d2, name2] = splitedPath2

        const paths1 = pdu.postPaths(
          name1,
          config.postsDir,
          config.rootDir,
          y1,
          m1,
          d1
        )
        const paths2 = pdu.postPaths(
          name2,
          config.postsDir,
          config.rootDir,
          y2,
          m2,
          d2
        )

        const documentText1 = await u.readFile(paths1.documentPath, 'utf8')
        const documentText2 = await u.readFile(paths2.documentPath, 'utf8')
        const publishdate1 = au.getPublishdate(documentText1)
        const publishdate2 = au.getPublishdate(documentText2)

        if (publishdate1 === null) {
          console.log(
            `an attribute publishdate doesn't exist in '${
              paths1.relativeDocumentPath
            }'.`
          )
          return
        } else if (publishdate2 === null) {
          ;`an attribute publishdate doesn't exist in '${
            paths2.relativeDocumentPath
          }'.`
          return
        }

        return publishdate1.valueOf() < publishdate2.valueOf()
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
