const fse = require('fs-extra')
const moment = require('moment')

const u = require('./utils')
const pdu = require('./postDraftUtils')
const au = require('./asciidocUtils')

module.exports = async (name, config) => {
  try {
    const exist = await pdu.exist(name, config.draftsDir, config.postsDir)
    const draftPaths = pdu.draftPaths(name, config.draftsDir, config.rootDir)
    const now = moment()
    const [year, month, date] = now.format('YYYY/MM/DD').split('/')
    const postPaths = pdu.postPaths(
      name,
      config.postsDir,
      config.rootDir,
      year,
      month,
      date
    )

    if (exist.drafts.length === 0) {
      console.log(
        `The draft '${name}' doesn't exist in '${draftPaths.relativeDir}'.`
      )
      console.log()
      if (exist.posts.length === 0) {
        console.log(
          `You can use new command to create the new draft '${name}'.`
        )
      } else {
        console.log(`You can use edit command to edit the post '${name}'.`)
      }
      return
    } else if (exist.posts.length !== 0) {
      const [, year, month, date] = exist.posts[0]
      const currentPostPaths = pdu.postPaths(
        name,
        config.postsDir,
        config.rootDir,
        year,
        month,
        date
      )
      console.log(
        `The post '${name}' already exists in '${
          currentPostPaths.relativeDir
        }'.`
      )
      console.log()
      console.log(
        `You can use update command insted to update the post '${name}' with the draft.`
      )
      return
    }

    console.log(`Preparing to publish '${name}'...`)

    console.log()
    console.log()

    {
      const draftDocumentText = await u.readFile(
        draftPaths.documentPath,
        'utf8'
      )
      const draftRev = au.getRevnumber(draftDocumentText)
      if (draftRev === null) {
        console.log(
          `The attribute revnumber is required in '${
            draftPaths.relativeDocumentPath
          }'`
        )
        console.log()
        console.log(
          `Please add revnumber (e.g. ':revnumber: v1.0.0') into the header of the document.`
        )
        return
      }
    }

    console.log(
      `Moving the draft '${name}' from '${draftPaths.relativeDir}' into '${
        postPaths.relativeDir
      }'...`
    )
    await fse.move(draftPaths.dir, postPaths.dir)

    console.log()

    {
      const postDocumentText = await u.readFile(postPaths.documentPath, 'utf8')
      console.log(`Updating the revision date of the post '${name}'...`)
      const replacedPostDocumentText = au.updateRevdate(
        au.updatePublishdate(postDocumentText, now.format()),
        now.format()
      )
      await u.writeFile(postPaths.documentPath, replacedPostDocumentText)
    }

    console.log()
    console.log()
    console.log()

    console.log(
      `The post '${name}' has successfully published in '${
        postPaths.relativeDir
      }'.`
    )
    console.log()
    console.log(`You can generate the posts data JSON from the posts!`)
  } catch (e) {
    console.log(`The command 'publish' failed with error:`)
    console.log()
    console.log(e)
  }
}
