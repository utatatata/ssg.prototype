const path = require('path')
const pkgDir = require('pkg-dir')

const defaultConfig = require('./defaultConfig')

const parseTags = tags => (tags ? tags.split(',') : [])

const overwrite = (rootDir, config, options) => {
  const draftsDir = path.resolve(rootDir, options.draftsDir || config.draftsDir)
  const postsDir = path.resolve(rootDir, options.postsDir || config.postsDir)
  const relativeDraftsDir = path.relative(rootDir, draftsDir)
  const relativePostsDir = path.relative(rootDir, postsDir)
  const author = options.author || config.author
  const email = options.email || config.email
  const revnumber = options.revnumber || config.revnumber
  const tags = parseTags(options.tags || config.tags)
  const summary = options.summary || config.summary
  const output = path.resolve(rootDir, options.output || config.output)
  const relativeOutput = output === '' ? path.relative(rootDir, output) : ''

  return {
    rootDir,
    draftsDir,
    postsDir,
    relativeDraftsDir,
    relativePostsDir,
    author,
    email,
    revnumber,
    tags,
    summary,
    output,
    relativeOutput,
  }
}

module.exports = async options => {
  const rootDir = await pkgDir(process.cwd())
  try {
    const userConfig = require(path.resolve(rootDir, 'ssgconfig.json'))
    return overwrite(rootDir, Object.assign(defaultConfig, userConfig), options)
  } catch (_) {
    return overwrite(rootDir, defaultConfig, options)
  }
}
