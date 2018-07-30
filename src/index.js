const list = require('./list')
const _new = require('./new')
const publish = require('./publish')
const edit = require('./edit')
const update = require('./update')
const generate = require('./generate')
const buildConfig = require('./buildConfig')
const init = require('./init')

const defaultConfig = require('./defaultConfig')

const program = require('commander')

program.version('v1.0.0', '-v, --version')

program
  .command('list')
  .description('display the list of the posts and the drafts')
  .option(
    '-d, --drafts-dir <drafts-dir>',
    `the drafts dir, default is '${defaultConfig.draftsDir}'`
  )
  .option(
    '-p, --posts-dir <posts-dir>',
    `the posts dir, default is '${defaultConfig.postsDir}'`
  )
  .action(async options => {
    const config = await buildConfig(options)
    await init(config)
    list(config)
  })

program
  .command('new <name>')
  .description('create a new draft')
  .option(
    '-d, --drafts-dir <drafts-dir>',
    `the drafts dir, default is '${defaultConfig.draftsDir}'`
  )
  .option(
    '-p, --posts-dir <posts-dir>',
    `the posts dir, default is '${defaultConfig.postsDir}'`
  )
  .option(
    '-a, --author <author>',
    `author, default is '${defaultConfig.author}'`
  )
  .option('-e, --email <email>', `Email, default is '${defaultConfig.email}'`)
  .option(
    '-r --revnumber, -- <revnumber>',
    `revision number, default is '${defaultConfig.revnumber}'`
  )
  .option(
    '-t, --tags <tags>',
    `tag list e.g. 'JavaScript, Node', default is '${defaultConfig.tags}'`
  )
  .option(
    '-s, --summary <summary>',
    `summary, default is '${defaultConfig.summary}'`
  )
  .action(async (name, options) => {
    const config = await buildConfig(options)
    await init(config)
    _new(name, config)
  })

program
  .command('publish <name>')
  .description('publish the new draft')
  .option(
    '-d, --drafts-dir <drafts-dir>',
    `the drafts dir, default is '${defaultConfig.draftsDir}'`
  )
  .option(
    '-p, --posts-dir <posts-dir>',
    `the posts dir, default is '${defaultConfig.postsDir}'`
  )
  .action(async (name, options) => {
    const config = await buildConfig(options)
    await init(config)
    publish(name, config)
  })

program
  .command('edit <name>')
  .description('create a udpate draft to edit the post')
  .option(
    '-d, --drafts-dir <drafts-dir>',
    `the drafts dir, default is '${defaultConfig.draftsDir}'`
  )
  .option(
    '-p, --posts-dir <posts-dir>',
    `the posts dir, default is '${defaultConfig.postsDir}'`
  )
  .action(async (name, options) => {
    const config = await buildConfig(options)
    await init(config)
    edit(name, config)
  })

program
  .command('update <name>')
  .description('publish the update draft to update the post')
  .option(
    '-d, --drafts-dir <drafts-dir>',
    `the drafts dir, default is '${defaultConfig.draftsDir}'`
  )
  .option(
    '-p, --posts-dir <posts-dir>',
    `the posts dir, default is '${defaultConfig.postsDir}'`
  )
  .action(async (name, options) => {
    const config = await buildConfig(options)
    await init(config)
    update(name, config)
  })

program
  .command('generate')
  .description('generate the posts data JSON from the posts')
  .option(
    '-p, --posts-dir <posts-dir>',
    `the posts dir, default is '${defaultConfig.postsDir}'`
  )
  .option(
    '-o, --output <output>',
    `output file path, default is '${defaultConfig.output}'`
  )
  .action(async options => {
    const config = await buildConfig(options)
    await init(config)
    generate(config)
  })

program.parse(process.argv)

if (process.argv.length < 3) {
  program.help()
}
