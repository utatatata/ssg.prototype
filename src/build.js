const path = require('path')
const asciidoctor = require('asciidoctor.js')()

const u = require('./utils')
const fsu = require('./fsUtils')

module.exports = async config => {
  console.log(
    `start building the posts data from '${path.resolve(config.postsDir)}/'...`
  )

  try {
    const posts = await fsu.readPosts(config.postsDir)

    const documentList = posts.map(splitedPath => {
      const document = asciidoctor.loadFile(path.resolve(...splitedPath))
      const attributes = document.attributes.$$smap
      return {
        title: attributes.doctitle,
        author: attributes.author,
        email: attributes.email,
        revnumber: attributes.revnumber,
        revdate: attributes.revdate,
        tags: attributes.tags,
        summary: attributes.summary,
        body: document.convert(),
      }
    })

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
    console.log(`The command 'build' failed with error:`)
    console.log()
    console.log(e)
  }
}
