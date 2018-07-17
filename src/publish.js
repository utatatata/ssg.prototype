const path = require('path')

const moment = require('moment')

const u = require('./utils')
const fsu = require('./fsUtils')

const mkdir = async relativeSplitedPath => {
  let currentPath = ''
  for (const piece of relativeSplitedPath) {
    currentPath = path.resolve(currentPath, piece)
    await u.mkdir(currentPath).catch(u.identity)
  }
}

module.exports = async (name, config) => {
  fsu.exist(name, config.draftsDir, config.postsDir).then(async exist => {
    if (exist.drafts.length === 0) {
      console.log(`The draft '${name}' doesn't exist.`)
      return
    }
    if (exist.posts.length !== 0) {
      console.log(`The post '${name}' already exist.`)
      return
    }

    const now = moment()
    const [year, month, date] = now.format('YYYY/MM/DD').split('/')
    console.log(`Start to publish '${name}'.`)
    await mkdir([config.postsDir, year, month, date])

    console.log()

    const oldDir = path.resolve(config.draftsDir, name)
    const publishDir = path.resolve(config.postsDir, year, month, date, name)
    console.log('Moving the draft')
    console.log(`'${oldDir}'`)
    console.log('into')
    console.log(`'${publishDir}'`)
    await u.rename(oldDir, publishDir)

    console.log()

    const documentPath = path.resolve(publishDir, 'index.asciidoc')
    console.log(`Updating revision date of the post '${name}'...`)
    await u
      .readFile(documentPath)
      .then(text => text.toString())
      .then(text => {
        const revdate = `:revdate: ${now.format()}\n`
        if (text.match(/^:revdate:/m)) {
          return text.replace(/^:revdate:.*[\r?\n]/m, revdate)
        } else {
          return text.replace(/^:revnumber:/m, `${revdate}:revnumber:`)
        }
      })
      .then(text => u.writeFile(documentPath, text))
      .then(_ => console.log() || console.log('Completed.'))
  })
}
