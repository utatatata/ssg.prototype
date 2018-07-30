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
  } else if (exist.posts.length === 0) {
    const relativePath = config.postsDir.replace(config.rootDir, '')
    console.log(`The post '${name}' doesn't exist in '${relativePath}'.`)
    console.log()
    console.log(
      `You can use publish command insted to publish the draft '${name}'.`
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
        `The revnumber of the update draft '${name}' must be larger than that of the post.`
      )
      console.log()
      console.log(`draft revision: ${draftRev.str}`)
      console.log(`post revision: ${postRev.str}`)
      return
    }
  }

  console.log(`Removing the current post '${name}' in '${relativePostDir}'...`)
  await fse.remove(postDir)
  console.log()
  console.log(
    `Moving the draft '${name}' from '${relativeDraftDir}' into '${relativePostDir}'...`
  )
  await fse.move(draftDir, postDir)

  console.log()

  console.log(`Updating the revision date of the post '${name}'...`)
  const now = moment()
  const text = (await u.readFile(postDocumentPath)).toString()
  const replacedText = au.updateRevdate(text, now.format())
  await u.writeFile(postDocumentPath, replacedText)

  console.log()
  console.log()
  console.log()

  console.log(
    `The post '${name}' has successfully updated in '${relativePostDir}'.`
  )
  console.log()
  console.log(`You can generate the posts data JSON from the posts!`)
}
