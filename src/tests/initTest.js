/* global before, after */

const http = require('http')
const app = require('../Main.js')
const { hasFailures } = require('./testUtils.js')

let server

before(function (done) {
  const tempServer = http.createServer()
  tempServer.listen(3000, function (err) {
    tempServer.close(function () {
      if (err) {
        console.log('Port 3000 is busy')
        done()
      } else {
        server = app.listen(3000)
        done()
      }
    })
  })
})

after(function () {
  if (server && server.listening) {
    server.close(() => {
      console.log('\nServer closed. Exiting test.')
      process.exit(hasFailures ? 1 : 0)
    })
  } else {
    console.log('\nNo server to close. Exiting test.')
    process.exit(hasFailures ? 1 : 0)
  }
})

require('./rootRouteTest.js')
require('./rocketLeagueRouteTest.js')
