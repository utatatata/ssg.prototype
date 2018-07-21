const path = require('path')
const asciidoctor = require('asciidoctor.js')()

const u = require('./utils')
const fsu = require('./fsUtils')

module.exports = async config => {
  console.log(
    `start building the posts data from '${path.resolve(config.postsDir)}/'...`
  )

  try {
    const posts = await fsu.readPosts(config.postsDir).then(
      u.mapP(splitedPath => {
        const document = asciidoctor.loadFile(
          path.resolve(...splitedPath, 'index.asciidoc')
        )
        const attributes = document.attributes.$$smap
        return {
          title: attributes.doctitle,
          author: attributes.author,
          email: attributes.email,
          revnumber: attributes.revnumber,
          revdate: attributes.revdate,
          tags: attributes.tags,
          description: attributes.description,
          body: document.convert(),
        }
      })
    )

    await u.writeFile(config.output, JSON.stringify(posts, null, 2))

    console.log()
    console.log()
    console.log(
      `The posts data '${path.basename(
        config.output
      )}' has successfully created in`
    )
    console.log()
    console.log(`'${config.output}'.`)
  } catch (_) {
    console.log(`The directory '${config.postsDir}' doesn't exist.`)
  }
}
