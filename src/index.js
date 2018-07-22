const list = require('./list')
const _new = require('./new')
const publish = require('./publish')
const generate = require('./generate')
const buildConfig = require('./buildConfig')
const init = require('./init')

const program = require('commander')

program.version('v1.0.0', '-v, --version')

program
  .command('list')
  .option('-d, --drafts-dir <drafts-dir>', 'Drafts dir')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .action(async options => {
    const config = await buildConfig(options)
    await init(config)
    list(config)
  })

program
  .command('new <name>')
  .option('-d, --drafts-dir <drafts-dir>', 'Drafts dir')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .option('-a, --author <author>', 'author')
  .option('-e, --email <email>', 'Email')
  .option('-r --revnumber, -- <revnumber>', 'Revision number')
  .option('-t, --tags <tags>', 'Tag list')
  .option('-s, --summary <summary>', 'Summary')
  .action(async (name, options) => {
    const config = await buildConfig(options)
    await init(config)
    _new(name, config)
  })

program
  .command('publish <name>')
  .option('-d, --drafts-dir <drafts-dir>', 'Drafts dir')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .action(async (name, options) => {
    const config = await buildConfig(options)
    await init(config)
    publish(name, config)
  })

program
  .command('generate')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .option('-o, --output <output>', 'Output file name')
  .action(async options => {
    const config = await buildConfig(options)
    await init(config)
    generate(config)
  })

program.parse(process.argv)

if (process.argv.length < 3) {
  program.help()
}
