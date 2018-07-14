const fs = require('fs')
const path = require('path')
const util = require('util')
const asciidoctor = require('asciidoctor.js')()

const readdir = util.promisify(fs.readdir)
const writeFile = util.promisify(fs.writeFile)

const concat = (ys, x) => ys.concat(x)
const map = f => xs => xs.map(f)
const filter = f => xs => xs.filter(f)
const reduce = f => xs => xs.reduce(f)

const mapP = f => xs => Promise.all(xs.map(x => f(x)))


module.exports = (base, output) => {
  readdir(path.resolve(base))
    .then(filter(year => year.match(/^\d+$/)))
    .then(map(year => path.resolve(base, year)))
    .then(mapP(p => readdir(p)
      .then(filter(month => month.match(/^0[1-9]|1[0-2]$/)))
      .then(map(month => path.resolve(p, month)))
    ))
    .then(reduce(concat))
    .then(mapP(p => readdir(p)
      .then(filter(day => day.match(/^0[1-9]|[1-2][0-9]|3[01]$/)))
      .then(map(day => path.resolve(p, day)))
    ))
    .then(reduce(concat))
    .then(mapP(p => readdir(p)
      .then(map(post => path.resolve(p, post)))
    ))
    .then(reduce(concat))
    .then(mapP(p => {
      const document = asciidoctor.loadFile(path.resolve(p, 'index.asciidoc'))
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
    }))
    .then(posts => writeFile(output, JSON.stringify(posts, null, 2)))
}
