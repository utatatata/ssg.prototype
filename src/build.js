const path = require('path')
const asciidoctor = require('asciidoctor.js')()

const u = require('./utils')
const fsu = require('./fsUtils')

module.exports = config => {
  console.log(
    `start building the posts data from '${path.resolve(config.postsDir)}/'...`
  )

  console.log()

  fsu
    .readPosts(config.postsDir)
    .then(
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
    .then(posts => u.writeFile(config.output, JSON.stringify(posts, null, 2)))
    .then(_ =>
      console.log(`complete to write to '${path.resolve(config.output)}'.`)
    )
    .catch(_ =>
      console.log(`The directory '${config.postsDir}' doesn't exist.`)
    )
}
