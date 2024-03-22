require('./Server/dbInit')
const server = require('./Server/server')

if (require.main === module) {
  server.start()
}

module.exports = server.app
