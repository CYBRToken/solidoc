
const exec = require('child_process').exec
const pino = require('pino')

const logger = pino({
  prettyPrint: true
})

const compile = (pathToRoot, callback) => {
  logger.info('Compiling %s', pathToRoot)

  const command = global.config.compiler || 'truffle compile'

  const process = exec(command, {
    cwd: pathToRoot
  })

  process.stdout.on('data', function (data) {
    console.log(data)
  })

  process.stderr.on('data', function (data) {
    logger.warn(data)
  })

  process.on('close', function () {
    if (typeof (callback) === 'function') {
      callback()
    }
  })
}

module.exports = {
  compile
}
