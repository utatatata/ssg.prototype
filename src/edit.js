const path = require('path')
const fse = require('fs-extra')
const u = require('./utils')
const pdu = require('./postDraftUtils')
const template = require('./template')

module.exports = async (name, config) => {
  const exist = await pdu.exist(name, config.draftsDir, config.postsDir)

  if (exist.drafts.length !== 0) {
    const relativePath = path
      .resolve(...exist.drafts[0])
      .replace(config.rootDir, '')
      .replace('/index.asciidoc', '')
    if (exist.posts.length !== 0) {
      console.log(
        `The update draft '${name}' already exists in '${relativePath}'.`
      )
      console.log()
      console.log(`You can edit the index.asciidoc and update them.`)
    } else {
      console.log(
        `The new draft '${name}' already exists in '${relativePath}'.`
      )
      console.log()
      console.log(`You can edit the index.asciidoc and publish them.`)
    }
    return
  } else if (exist.posts.length === 0) {
    const relativePath = config.postsDir.replace(config.rootDir, '')
    console.log(`The post '${name}' doesn't exist in '${relativePath}'.`)
    console.log()
    console.log(
      `You can use new command instead to create the new draft '${name}'.`
    )
    return
  }

  console.log(`Creating the draft '${name}'...`)

  const [, year, month, date, ,] = exist.posts[0]
  const postDir = path.resolve(config.postsDir, year, month, date, name)
  const draftDir = path.resolve(config.draftsDir, name)
  const relativePostDir = postDir.replace(config.rootDir, '')
  const relativeDraftDir = draftDir.replace(config.rootDir, '')

  console.log()
  console.log()

  console.log(
    `Copying the post '${name}' from '${relativePostDir}' into '${relativeDraftDir}'...`
  )
  fse.copy(postDir, draftDir)

  console.log()
  console.log()
  console.log()

  console.log(
    `The update draft '${name}' has successfully created in '${relativeDraftDir}'.`
  )
  console.log()
  console.log(`You can edit the index.asciidoc and update them!`)
}
