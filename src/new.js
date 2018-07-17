const path = require('path')

const u = require('./utils')
const fsu = require('./fsUtils')
const template = require('./template')

module.exports = (
  name,
  author,
  email,
  revnumber,
  tags,
  summary,
  draftsDir,
  postsDir
) => {
  author = author || 'author'
  email = email || ''
  revnumber = revnumber || ''
  tags = tags ? tags.split(',') : []
  summary = summary || ''

  fsu.exist(name, draftsDir, postsDir).then(exist => {
    if (exist.drafts.length !== 0) {
      console.log(`The draft '${name}' already exists`)
      console.log()
      console.log(`in '${path.resolve(draftsDir, name)}'.`)
      return
    }
    if (exist.posts.length !== 0) {
      console.log(`The post '${name}' already exists`)
      console.log()
      console.log(`in '${path.resolve(...exist.posts[0])}'.`)
      return
    }

    console.log(`Creating the draft '${name}'...`)
    u.mkdir(path.resolve(draftsDir, name)).catch(_ => {})
    u.writeFile(
      path.resolve(draftsDir, name, 'index.asciidoc'),
      template(author, email, revnumber, tags, summary)
    )
    console.log(`Completed.`)
  })
}
