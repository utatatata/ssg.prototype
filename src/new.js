const path = require('path')

const u = require('./utils')
const fsu = require('./fsUtils')
const template = require('./template')

module.exports = async (name, config) => {
  const exist = await fsu.exist(name, config.draftsDir, config.postsDir)

  if (exist.drafts.length !== 0) {
    console.log(`The draft '${name}' already exists in`)
    console.log()
    console.log(`'${path.resolve(...exist.drafts[0])}'.`)
    return
  }
  if (exist.posts.length !== 0) {
    console.log(`The post '${name}' already exists in`)
    console.log()
    console.log(`'${path.resolve(...exist.posts[0])}'.`)
    return
  }

  console.log(`Creating the draft '${name}'...`)

  const draftPath = path.resolve(config.draftsDir, name)
  await u.mkdirp(draftPath)
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

  console.log(`The new draft '${name}' has successfully created in`)
  console.log()
  console.log(`'${draftPath}'.`)
}
