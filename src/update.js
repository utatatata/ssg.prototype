const fse = require('fs-extra')
const moment = require('moment')

const u = require('./utils')
const pdu = require('./postDraftUtils')
const au = require('./asciidocUtils')

module.exports = async (name, config) => {
  try {
    const exist = await pdu.exist(name, config.draftsDir, config.postsDir)
    const draftPaths = pdu.draftPaths(name, config.draftsDir, config.rootDir)

    if (exist.drafts.length === 0) {
      console.log(
        `The draft '${name}' doesn't exist in '${config.relativeDraftsDir}'.`
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
    } else if (exist.posts.length === 0) {
      console.log(
        `The post '${name}' doesn't exist in '${config.relativePostsDir}'.`
      )
      console.log()
      console.log(
        `You can use publish command insted to publish the draft '${name}'.`
      )
      return
    }

    const [, year, month, date, ,] = exist.posts[0]
    const postPaths = pdu.postPaths(
      name,
      config.postsDir,
      config.rootDir,
      year,
      month,
      date
    )

    console.log(`Preparing to update '${name}'...`)

    console.log()
    console.log()

    {
      const draftDocumentText = (await u.readFile(
        draftPaths.documentPath
      )).toString()
      const postDocumentText = (await u.readFile(
        postPaths.documentPath
      )).toString()

      const postRev = au.getRevnumber(postDocumentText)
      const draftRev = au.getRevnumber(draftDocumentText)
      if (postRev === null || draftRev === null) {
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
      if (!(au.compareRevnumber(draftRev, postRev) > 0)) {
        console.log(
          `The revnumber of the update draft '${name}' must be larger than that of the post.`
        )
        console.log()
        console.log(`draft revision: v${draftRev.str}`)
        console.log(`post revision: v${postRev.str}`)
        return
      }
    }

    console.log(
      `Removing the current post '${name}' in '${postPaths.relativeDir}'...`
    )
    await fse.remove(postPaths.dir)
    console.log()
    console.log(
      `Moving the draft '${name}' from '${draftPaths.relativeDir}' into '${
        postPaths.relativeDir
      }'...`
    )
    await fse.move(draftPaths.dir, postPaths.dir)

    console.log()

    console.log(`Updating the revision date of the post '${name}'...`)
    {
      const postDocumentText = (await u.readFile(
        postPaths.documentPath
      )).toString()
      const now = moment()
      const replacedPostDocumentText = au.updateRevdate(
        postDocumentText,
        now.format()
      )
      await u.writeFile(postPaths.documentPath, replacedPostDocumentText)
    }

    console.log()
    console.log()
    console.log()

    console.log(
      `The post '${name}' has successfully updated in '${
        postPaths.relativeDir
      }'.`
    )
    console.log()
    console.log(`You can generate the posts data JSON from the posts!`)
  } catch (e) {
    console.log(`The command 'update' failed with error:`)
    console.log()
    console.log(e)
  }
}
