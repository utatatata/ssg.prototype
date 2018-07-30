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
    if (exist.posts.length === 0) {
      console.log(`The new draft '${name}' doesn't exist in '${relativePath}'.`)
      console.log()
      console.log(`You can use new command to create the new draft '${name}'.`)
    } else {
      console.log(
        `The update draft '${name}' doesn't exist in '${relativePath}'.`
      )
      console.log()
      console.log(`You can use edit command to edit the post '${name}'.`)
    }
    return
  } else if (exist.posts.length !== 0) {
    const relativePath = path
      .resolve(...exist.posts[0])
      .replace(config.rootDir, '')
      .replace('/index.asciidoc', '')
    console.log(`The post '${name}' already exists in '${relativePath}'.`)
    console.log()
    console.log(
      `You can use update command insted to update the post '${name}' with the draft.`
    )
    return
  }

  const now = moment()
  const draftDir = path.resolve(config.draftsDir, name)
  const postDir = path.resolve(config.postsDir, now.format('YYYY/MM/DD'), name)
  const relativeDraftDir = draftDir.replace(config.rootDir, '')
  const relativePostDir = postDir.replace(config.rootDir, '')
  const draftDocumentPath = path.resolve(draftDir, 'index.asciidoc')
  const postDocumentPath = path.resolve(postDir, 'index.asciidoc')
  const relativeDraftDocumentPath = draftDocumentPath
    .replace(config.rootDir, '')
    .replace('index.asciidoc', '')
  const draftText = (await u.readFile(draftDocumentPath)).toString()

  console.log(`Preparing to publish '${name}'...`)

  console.log()
  console.log()

  {
    const rev = au.getRevnumber(draftText)
    if (rev === null) {
      console.log(
        `The attribute revnumber is required in '${relativeDraftDocumentPath}'`
      )
      console.log()
      console.log(
        `Please add revnumber (e.g. ':revnumber: v1.0.0') into the header of the document.`
      )
      return
    }
  }

  console.log(
    `Moving the draft '${name}' from '${relativeDraftDir}' into '${relativePostDir}'...`
  )
  await fse.move(draftDir, postDir)

  console.log()

  {
    const postText = (await u.readFile(postDocumentPath)).toString()
    console.log(`Updating the revision date of the post '${name}'...`)
    const replacedPostText = au.updateRevdate(postText, now.format())
    await u.writeFile(postDocumentPath, replacedPostText)
  }

  console.log()
  console.log()
  console.log()

  console.log(
    `The post '${name}' has successfully published in '${relativePostDir}'.`
  )
  console.log()
  console.log(`You can generate the posts data JSON from the posts!`)
}
