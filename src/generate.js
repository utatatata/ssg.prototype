const path = require('path')
const fse = require('fs-extra')
const asciidoctor = require('asciidoctor.js')()

const u = require('./utils')
const pdu = require('./postDraftUtils')

module.exports = async config => {
  try {
    console.log(
      `Generating the posts data JSON from the posts in '${
        config.relativePostsDir
      }'...`
    )

    const splitedPostPathList = await pdu.readPosts(config.postsDir)

    const documentJSONList = splitedPostPathList.map(splitedPath => {
      const document = asciidoctor.loadFile(path.join(...splitedPath))
      return {
        path: splitedPath,
        title: document.getAttribute('doctitle'),
        author: document.getAttribute('author'),
        email: document.getAttribute('email'),
        publishdate: document.getAttribute('publishdate'),
        revnumber: document.getAttribute('revnumber'),
        revdate: document.getAttribute('revdate'),
        tags: document.getAttribute('tags'),
        summary: document.getAttribute('summary'),
        body: document.convert(),
      }
    })

    await fse.mkdirp(path.dirname(config.output))
    await u.writeFile(config.output, JSON.stringify(documentJSONList, null, 2))

    console.log()
    console.log()
    console.log()

    console.log(
      `The posts data JSON has successfully created in '${
        config.relativeOutput
      }'.`
    )
  } catch (e) {
    console.log(`The command 'generate' failed with error:`)
    console.log()
    console.log(e)
  }
}
