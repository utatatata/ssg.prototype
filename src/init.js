const fse = require('fs-extra')

module.exports = config =>
  Promise.all([fse.mkdirp(config.draftsDir), fse.mkdirp(config.postsDir)])
