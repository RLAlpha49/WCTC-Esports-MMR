const express = require('express')
const app = express()
const port = 3000
const appController = require('./Controllers/AppController')

app.use('/', appController)

function start () {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

module.exports = { start }
