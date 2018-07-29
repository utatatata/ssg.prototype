const path = require('path')
const fse = require('fs-extra')
const u = require('./utils')
const pdu = require('./PostDraftUtils')
const template = require('./template')

module.exports = async (name, config) => {
  const exist = await pdu.exist(name, config.draftsDir, config.postsDir)

  if (exist.posts.length !== 0) {
    const relativePath = path
      .resolve(...exist.posts[0])
      .replace(config.rootDir, '')
      .replace('/index.asciidoc', '')
    console.log(`The post '${name}' already exists in '${relativePath}'.`)
    console.log()
    console.log(`To edit the post '${name}', you can use edit command instead.`)
    return
  }
  if (exist.drafts.length !== 0) {
    const relativePath = path
      .resolve(...exist.drafts[0])
      .replace(config.rootDir, '')
      .replace('/index.asciidoc', '')
    console.log(`The draft '${name}' already exists in '${relativePath}'.`)
    console.log()
    console.log(`You can edit the index.asciidoc and publish them.`)
    return
  }

  console.log(`Creating the draft '${name}'...`)

  const draftPath = path.resolve(config.draftsDir, name)
  await fse.mkdirp(draftPath)
  await u.writeFile(
    path.resolve(draftPath, 'index.asciidoc'),
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

  console.log(
    `The new draft '${name}' has successfully created in '${draftPath
      .replace(config.rootDir, '')
      .replace('/index.asciidoc', '')}'.`
  )

  console.log()
  console.log()

  console.log(`You can edit the index.asciidoc and publish them!`)
}
