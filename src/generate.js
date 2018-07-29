const path = require('path')
const asciidoctor = require('asciidoctor.js')()

const u = require('./utils')
const pdu = require('./PostDraftUtils')

module.exports = async config => {
  console.log(
    `start generating the posts data from '${path.resolve(
      config.postsDir
    )}/'...`
  )

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

    await u.mkdirp(path.dirname(config.output))
    await u.writeFile(config.output, JSON.stringify(documentList, null, 2))

    console.log()
    console.log()
    console.log(
      `The posts data '${path.basename(
        config.output
      )}' has successfully created in`
    )
    console.log()
    console.log(`'${config.output}'.`)
  } catch (e) {
    console.log(`The command 'generate' failed with error:`)
    console.log()
    console.log(e)
  }
}
