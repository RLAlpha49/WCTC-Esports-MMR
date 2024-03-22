require('./Server/dbInit')
const server = require('./Server/Server.js')

if (require.main === module) {
  server.start()
}

module.exports = server.app
