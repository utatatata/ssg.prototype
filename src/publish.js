const path = require('path')
const fse = require('fs-extra')
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
    const relativePath = config.draftsDir.replace(config.rootDir, '')
    console.log(`The draft '${name}' doesn't exist in '${relativePath}'.`)
    console.log()
    console.log(`To create new draft '${name}', you can use new command.`)
    return
  }
  if (exist.posts.length !== 0) {
    const relativePath = path
      .resolve(...exist.posts[0])
      .replace(config.rootDir, '')
      .replace('/index.asciidoc', '')
    console.log(`The post '${name}' already exists in '${relativePath}'.`)
    console.log()
    console.log(
      `To publish the post '${name}', you can use update command insted.`
    )
    return
  }

  console.log(`Preparing to publish '${name}'...`)

  console.log()
  console.log()

  const now = moment()
  const oldDir = path.resolve(config.draftsDir, name)
  const publishDir = path.resolve(
    config.postsDir,
    now.format('YYYY/MM/DD'),
    name
  )
  const relativeOldDir = oldDir.replace(config.rootDir, '')
  const relativePublishDir = publishDir.replace(config.rootDir, '')

  console.log(
    `Moving the draft '${name}' from '${relativeOldDir}' into '${relativePublishDir}'...`
  )
  await fse.move(oldDir, publishDir)

  console.log()

  console.log(`Updating revision date of the post '${name}'...`)
  const documentPath = path.resolve(publishDir, 'index.asciidoc')
  const text = (await u.readFile(documentPath)).toString()
  const replacedText = updateRevdate(text, now.format())
  await u.writeFile(documentPath, replacedText)

  console.log()
  console.log()

  console.log(
    `The post '${name}' has successfully published in '${relativePublishDir}'.`
  )

  console.log()
  console.log()

  console.log(`You can generate the JSON file of the posts data!`)
}
