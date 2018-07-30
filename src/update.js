const path = require('path')
const fse = require('fs-extra')
const moment = require('moment')

const u = require('./utils')
const pdu = require('./postDraftUtils')
const au = require('./asciidocUtils')

module.exports = async (name, config) => {
  const exist = await pdu.exist(name, config.draftsDir, config.postsDir)

  if (exist.drafts.length === 0) {
    const relativePath = config.draftsDir.replace(config.rootDir, '')
    console.log(`The draft '${name}' doesn't exist in '${relativePath}'.`)
    console.log()
    console.log(`To create new draft '${name}', you can use new command.`)
    return
  }
  if (exist.posts.length === 0) {
    const relativePath = config.postsDir.replace(config.rootDir, '')
    console.log(`The post '${name}' doesn't exist in '${relativePath}'.`)
    console.log()
    console.log(
      `To publish the post '${name}', you can use update command insted.`
    )
    return
  }

  console.log(`Preparing to update '${name}'...`)

  console.log()
  console.log()

  const [, year, month, date, ,] = exist.posts[0]
  const postDir = path.resolve(config.postsDir, year, month, date, name)
  const draftDir = path.resolve(config.draftsDir, name)
  const relativePostDir = postDir.replace(config.rootDir, '')
  const relativeDraftDir = draftDir.replace(config.rootDir, '')
  const postDocumentPath = path.resolve(postDir, 'index.asciidoc')
  const draftDocumentPath = path.resolve(draftDir, 'index.asciidoc')

  {
    const post = (await u.readFile(postDocumentPath)).toString()
    const draft = (await u.readFile(draftDocumentPath)).toString()
    const postRev = au.getRevnumber(post)
    const draftRev = au.getRevnumber(draft)
    if (!(au.compareRevnumber(draftRev, postRev) > 0)) {
      console.log(
        `revnumber of the update draft '${name}' must be larger than that of the post.`
      )
      console.log(`draft revision: ${draftRev.str}`)
      console.log(`post revision: ${postRev.str}`)
      return
    }
  }

  console.log(
    `Moving the draft '${name}' from '${relativeDraftDir}' into '${relativePostDir}'...`
  )
  await fse.remove(postDir)
  await fse.move(draftDir, postDir)

  console.log(`Updating revision date of the post '${name}'...`)
  const now = moment()
  const text = (await u.readFile(postDocumentPath)).toString()
  const replacedText = au.updateRevdate(text, now.format())
  await u.writeFile(postDocumentPath, replacedText)

  console.log()
  console.log()

  console.log(
    `The post '${name}' has successfully updated in '${relativePostDir}'.`
  )

  console.log()
  console.log()

  console.log(`You can generate the JSON file of the posts data!`)
}
