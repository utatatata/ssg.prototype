const path = require('path')
const pkgDir = require('pkg-dir')

const u = require('./utils')

const defaultConfig = {
  draftsDir: './drafts',
  postsDir: './posts',
  author: '',
  email: '',
  revnumber: 'v1.0.0',
  tags: '',
  summary: '',
  output: './posts.json',
}

const parseTags = tags => (tags ? tags.split(',') : [])

const overwrite = (config, options) => ({
  draftsDir: options.draftsDir || config.draftsDir,
  postsDir: options.postsDir || config.postsDir,
  author: options.author || config.author,
  email: options.email || config.email,
  revnumber: options.revnumber || config.revnumber,
  tags: parseTags(options.tags || config.tags),
  summary: options.summary || config.summary,
  output: options.output || config.output,
})

module.exports = async options => {
  try {
    const rootDir = await pkgDir(__dirname)
    const userConfig = require(path.resolve(rootDir, 'ssgconfig.json'))
    return overwrite(Object.assign(defaultConfig, userConfig), options)
  } catch (_) {
    return overwrite(defaultConfig, options)
  }
}
