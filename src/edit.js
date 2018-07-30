const fse = require('fs-extra')

const pdu = require('./postDraftUtils')

module.exports = async (name, config) => {
  try {
    const exist = await pdu.exist(name, config.draftsDir, config.postsDir)
    const draftPaths = pdu.draftPaths(name, config.draftsDir, config.rootDir)

    if (exist.drafts.length !== 0) {
      if (exist.posts.length !== 0) {
        console.log(
          `The update draft '${name}' already exists in '${
            draftPaths.relativeDir
          }'.`
        )
        console.log()
        console.log(`You can edit the index.asciidoc and update them.`)
      } else {
        console.log(
          `The new draft '${name}' already exists in '${
            draftPaths.relativeDir
          }'.`
        )
        console.log()
        console.log(`You can edit the index.asciidoc and publish them.`)
      }
      return
    } else if (exist.posts.length === 0) {
      console.log(
        `The post '${name}' doesn't exist in '${config.relativePostsDir}'.`
      )
      console.log()
      console.log(
        `You can use new command instead to create the new draft '${name}'.`
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

    console.log(`Creating the draft '${name}'...`)

    console.log()
    console.log()

    console.log(
      `Copying the post '${name}' from '${postPaths.relativeDir}' into '${
        draftPaths.relativeDir
      }'...`
    )
    fse.copy(postPaths.dir, draftPaths.dir)

    console.log()
    console.log()
    console.log()

    console.log(
      `The update draft '${name}' has successfully created in '${
        draftPaths.relativeDir
      }'.`
    )
    console.log()
    console.log(`You can edit the index.asciidoc and update them!`)
  } catch (e) {
    console.log(`The command 'edit' failed with error:`)
    console.log()
    console.log(e)
  }
}
