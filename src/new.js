const path = require('path')

const u = require('./utils')
const fsu = require('./fsUtils')
const template = require('./template')

module.exports = (name, config) => {
  fsu.exist(name, config.draftsDir, config.postsDir).then(async exist => {
    if (exist.drafts.length !== 0) {
      console.log(`The draft '${name}' already exists in`)
      console.log()
      console.log(`'${path.resolve(config.draftsDir, name)}'.`)
      return
    }
    if (exist.posts.length !== 0) {
      console.log(`The post '${name}' already exists in`)
      console.log()
      console.log(`'${path.resolve(...exist.posts[0])}'.`)
      return
    }

    console.log(`Creating the draft '${name}'...`)
    await u.mkdir(path.resolve(config.draftsDir, name)).catch(_ => {})
    await u.writeFile(
      path.resolve(config.draftsDir, name, 'index.asciidoc'),
      template(
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
    console.log(`'${path.resolve(config.draftsDir, name)}'.`)
  })
}
