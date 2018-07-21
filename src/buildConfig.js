const path = require('path')
const pkgDir = require('pkg-dir')

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

const overwrite = (rootDir, config, options) => ({
  rootDir,
  draftsDir: path.resolve(rootDir, options.draftsDir || config.draftsDir),
  postsDir: path.resolve(rootDir, options.postsDir || config.postsDir),
  author: options.author || config.author,
  email: options.email || config.email,
  revnumber: options.revnumber || config.revnumber,
  tags: parseTags(options.tags || config.tags),
  summary: options.summary || config.summary,
  output: path.resolve(rootDir, options.output || config.output),
})

module.exports = async options => {
  const rootDir = await pkgDir(process.cwd())
  try {
    const userConfig = require(path.resolve(rootDir, 'ssgconfig.json'))
    return overwrite(rootDir, Object.assign(defaultConfig, userConfig), options)
  } catch (_) {
    return overwrite(rootDir, defaultConfig, options)
  }
}
