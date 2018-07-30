const path = require('path')
const fse = require('fs-extra')
const asciidoctor = require('asciidoctor.js')()

const u = require('./utils')
const pdu = require('./postDraftUtils')

module.exports = async config => {
  const relativePostsDir = config.postsDir.replace(config.rootDir, '')
  console.log(`Generating the posts data from '${relativePostsDir}'...`)

  try {
    const posts = await pdu.readPosts(config.postsDir)

    const documentList = posts.map(splitedPath => {
      const document = asciidoctor.loadFile(path.resolve(...splitedPath))
      return {
        title: document.getAttribute('doctitle'),
        author: document.getAttribute('author'),
        email: document.getAttribute('email'),
        revnumber: document.getAttribute('revnumber'),
        revdate: document.getAttribute('revdate'),
        tags: document.getAttribute('tags'),
        summary: document.getAttribute('summary'),
        body: document.convert(),
      }
    })

    await fse.mkdirp(path.dirname(config.output))
    await u.writeFile(config.output, JSON.stringify(documentList, null, 2))

    console.log()
    console.log()

    const relativeOutput = config.output.replace(config.rootDir, '')
    console.log(
      `The posts data has successfully created in '${relativeOutput}'.`
    )
  } catch (e) {
    console.log(`The command 'generate' failed with error:`)
    console.log()
    console.log(e)
  }
}
