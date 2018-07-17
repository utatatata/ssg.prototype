const list = require('./list')
const build = require('./build')

const program = require('commander')

program
  .version('v1.0.0', '-v, --version')

program
  .command('list')
  .option('-p, --drafts-dir <drafts-dir>', 'Drafts dir')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .action(options => {
    list(options.draftsDir || './drafts', options.postsDir || './posts')
  })

program
  .command('new <name>')
  .action((name, options) => {
      // TODO
      console.log(name, optoins)
  })

program
  .command('publish <name>')
  .action((name, options) => {
      // TODO
      console.log(name, optoins)
  })

program
  .command('build')
  .option('-p, --posts-dir <posts-dir>', 'Posts dir')
  .option('-o, --output <output>', 'Output file name')
  .action(options => {
    build(options.posts_dir || './posts', options.output || './posts.json')
  })

program.parse(process.argv)
