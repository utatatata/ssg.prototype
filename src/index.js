const build = require('./build')

const program = require('commander')

program
  .version('v1.0.0', '-v, --version')

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
  .option('-b, --base <base>', 'Posts base dir')
  .option('-o, --output <output>', 'Output file name')
  .action(options => {
      build(options.base || './posts', options.output || './posts.json')
  })

program.parse(process.argv)
