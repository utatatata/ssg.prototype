const fse = require('fs-extra')

const u = require('./utils')
const pdu = require('./postDraftUtils')
const template = require('./template')

module.exports = async (name, config) => {
  try {
    const exist = await pdu.exist(name, config.draftsDir, config.postsDir)
    const draftPaths = pdu.draftPaths(name, config.draftsDir, config.rootDir)

    if (exist.drafts.length !== 0) {
      if (exist.posts.length === 0) {
        console.log(
          `The new draft '${name}' already exists in '${
            draftPaths.relativeDir
          }'.`
        )
        console.log()
        console.log(`You can edit the index.asciidoc and publish them.`)
      } else {
        console.log(
          `The update draft '${name}' already exists in '${
            draftPaths.relativeDir
          }'.`
        )
        console.log()
        console.log(`You can edit the index.asciidoc and update them.`)
      }
      return
    } else if (exist.posts.length !== 0) {
      const [year, month, date] = exist.posts[0]
      const postPaths = pdu.postPaths(
        name,
        config.postsDir,
        config.rootDir,
        year,
        month,
        date
      )
      console.log(
        `The post '${name}' already exists in '${postPaths.relativeDir}'.`
      )
      console.log()
      console.log(
        `You can use edit command instead to edit the post '${name}'.`
      )
      return
    }

    console.log(`Creating the draft '${name}'...`)

    await fse.mkdirp(draftPaths.dir)
    await u.writeFile(
      draftPaths.documentPath,
      template(
        name,
        config.author,
        config.email,
        config.revnumber,
        config.tags,
        config.summary
      )
    )

    console.log()
    console.log()
    console.log()

    console.log(
      `The new draft '${name}' has successfully created in '${
        draftPaths.relativeDir
      }'.`
    )
    console.log()
    console.log(`You can edit the index.asciidoc and publish them!`)
  } catch (e) {
    console.log(`The command 'new' failed with error:`)
    console.log()
    console.log(e)
  }
}
