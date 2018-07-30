const path = require('path')
const fse = require('fs-extra')
const u = require('./utils')
const pdu = require('./postDraftUtils')
const template = require('./template')

module.exports = async (name, config) => {
  const exist = await pdu.exist(name, config.draftsDir, config.postsDir)

  if (exist.posts.length === 0) {
    const relativePath = config.postsDir.replace(config.rootDir, '')
    console.log(`The post '${name}' doesn't exist in '${relativePath}'.`)
    console.log()
    console.log(
      `To create the new draft '${name}', you can use new command instead.`
    )
    return
  }
  if (exist.drafts.length !== 0) {
    const relativePath = path
      .resolve(...exist.drafts[0])
      .replace(config.rootDir, '')
      .replace('/index.asciidoc', '')
    console.log(`The draft '${name}' already exists in '${relativePath}'.`)
    console.log()
    console.log(`You can edit the index.asciidoc and update them.`)
    return
  }

  console.log(`Creating the draft '${name}'...`)

  const [, year, month, date, ,] = exist.posts[0]
  const postDir = path.resolve(config.postsDir, year, month, date, name)
  const draftDir = path.resolve(config.draftsDir, name)
  const relativePostDir = postDir.replace(config.rootDir, '')
  const relativeDraftDir = draftDir.replace(config.rootDir, '')

  console.log(
    `Copying the post '${name}' from '${relativePostDir}' into '${relativeDraftDir}'...`
  )
  fse.copy(postDir, draftDir)

  console.log()
  console.log()

  console.log(
    `The draft '${name}' has successfully created in '${relativeDraftDir}'.`
  )

  console.log()
  console.log()

  console.log(`You can edit the index.asciidoc and update them!`)
}
