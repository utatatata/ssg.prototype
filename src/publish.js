const path = require('path')

const moment = require('moment')

const u = require('./utils')
const pdu = require('./PostDraftUtils')

const updateRevdate = (documentText, dateString) => {
  const revdate = `:revdate: ${dateString}\n`
  if (documentText.match(/^:revdate:/m)) {
    return documentText.replace(/^:revdate:.*[\r?\n]/m, revdate)
  } else {
    return documentText.replace(/^:revnumber:/m, `${revdate}:revnumber:`)
  }
}

module.exports = async (name, config) => {
  const exist = await pdu.exist(name, config.draftsDir, config.postsDir)
  if (exist.drafts.length === 0) {
    console.log(`The draft '${name}' doesn't exist.`)
    return
  }
  if (exist.posts.length !== 0) {
    console.log(`The post '${name}' already exists in`)
    console.log()
    console.log(`'${path.resolve(...exist.posts[0])}'.`)
    return
  }

  console.log(`Start to publish '${name}'.`)

  const now = moment()
  const oldDir = path.resolve(config.draftsDir, name)
  const publishDir = path.resolve(
    config.postsDir,
    now.format('YYYY/MM/DD'),
    name
  )
  await u.mkdirp(path.dirname(publishDir))

  console.log()

  console.log(`Moving the draft '${name}' from`)
  console.log(`'${oldDir}'`)
  console.log('into')
  console.log(`'${publishDir}'...`)
  await u.rename(oldDir, publishDir)

  console.log()

  console.log(`Updating revision date of the post '${name}'...`)
  const documentPath = path.resolve(publishDir, 'index.asciidoc')
  const text = (await u.readFile(documentPath)).toString()
  const replacedText = updateRevdate(text, now.format())
  await u.writeFile(documentPath, replacedText)

  console.log()
  console.log()

  console.log(`The post '${name}' has successfully published in`)
  console.log()
  console.log(`'${publishDir}'.`)
}
