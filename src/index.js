const list = require('./list')
const _new = require('./new')
// const publish = require('./publish')
const build = require('./build')

const program = require('commander')

program.version('v1.0.0', '-v, --version')

program
  .command('list')
  .option('-d, --drafts-dir <drafts-dir>', 'Drafts dir')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .action(options => {
    list(options.draftsDir || './drafts', options.postsDir || './posts')
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
  .action((name, options) => {
    _new(
      name,
      options.author,
      options.email,
      options.revnumber,
      options.tags,
      options.summary,
      options.draftsDir || './drafts',
      options.postsDir || './posts'
    )
  })

program
  .command('publish <name>')
  .option('-d, --drafts-dir <drafts-dir>', 'Drafts dir')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .action((name, options) => {
    // TODO
    // publish(name, options.draftsDir || './drafts', options.postsDir || './posts')
  })

program
  .command('build')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .option('-o, --output <output>', 'Output file name')
  .action(options => {
    build(options.posts_dir || './posts', options.output || './posts.json')
  })

program.parse(process.argv)
