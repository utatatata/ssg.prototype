const u = require('./utils')

module.exports = config =>
  Promise.all([u.mkdirp(config.draftsDir), u.mkdirp(config.postsDir)])
