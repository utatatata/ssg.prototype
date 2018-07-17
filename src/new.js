const path = require('path')

const u = require('./utils')
const fsu = require('./fsUtils')
const template = require('./template')

module.exports = (name, config) => {
  fsu.exist(name, config.draftsDir, config.postsDir).then(exist => {
    if (exist.drafts.length !== 0) {
      console.log(`The draft '${name}' already exists`)
      console.log()
      console.log(`in '${path.resolve(config.draftsDir, name)}'.`)
      return
    }
    if (exist.posts.length !== 0) {
      console.log(`The post '${name}' already exists`)
      console.log()
      console.log(`in '${path.resolve(...exist.posts[0])}'.`)
      return
    }

    console.log(`Creating the draft '${name}'...`)
    u.mkdir(path.resolve(config.draftsDir, name)).catch(_ => {})
    u.writeFile(
      path.resolve(config.draftsDir, name, 'index.asciidoc'),
      template(
        config.author,
        config.email,
        config.revnumber,
        config.tags,
        config.summary
      )
    )
    console.log(`Completed.`)
  })
}
