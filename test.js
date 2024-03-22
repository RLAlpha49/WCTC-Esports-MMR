/* global describe, it, before, after */

const chalk = require('chalk')
const request = require('supertest')
const { expect } = require('chai')
const app = require('./Main.js')
const http = require('http')

let server
let hasFailures = false

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

function checkAssertion (assertion, message) {
  console.log(`Checking: ${message}`)
  try {
    assertion()
    console.log(chalk.green('√ Passed'))
  } catch (error) {
    console.log(chalk.red('✖ Failed:', error.message))
    hasFailures = true
  }
}

describe('Testing the root path', () => {
  it('It should respond to the GET method', async () => {
    const response = await request(app).get('/')

    checkAssertion(() => expect(response.statusCode).to.equal(200), 'status code is 200')
    checkAssertion(() => expect(response.headers['content-type']).to.include('text/html'), 'content-type is text/html')
    checkAssertion(() => expect(response.text).to.include('<title>WCTC Esports MMR</title>'), 'response includes <title>WCTC Esports MMR</title>')
    checkAssertion(() => expect(response.text).to.include('<h1>WCTC Esports MMR</h1>'), 'response includes <h1>WCTC Esports MMR</h1>')
    checkAssertion(() => expect(response.text).to.include('Welcome to the WCTC Esports Program website.'), 'response includes the welcome message')
    checkAssertion(() => expect(response.text).to.include('<h2>Games</h2>'), 'response includes <h2>Games</h2>')
    checkAssertion(() => expect(response.text).to.include('<a href="/rocket-league">Rocket League</a>'), 'response includes the link to the Rocket League page')
    checkAssertion(() => expect(response.text).to.include('<script src="/scripts/lazyLoadImages.js"></script>'), 'response includes the script tag for lazyLoadImages.js')
  })
})

describe('Testing the /rocket-league route', () => {
  it('It should respond to the GET method with the correct HTML', async () => {
    const response = await request(app).get('/rocket-league')

    checkAssertion(() => expect(response.statusCode).to.equal(200), 'status code is 200')
    checkAssertion(() => expect(response.headers['content-type']).to.include('text/html'), 'content-type is text/html')
    checkAssertion(() => expect(response.text).to.include('<title>WCTC Esports Program - Rocket League</title>'), 'response includes <title>WCTC Esports Program - Rocket League</title>')
    checkAssertion(() => expect(response.text).to.include('<h1>Rocket League MMR</h1>'), 'response includes <h1>Rocket League MMR</h1>')
    checkAssertion(() => expect(response.text).to.include('<h2>Varsity</h2>'), 'response includes <h2>Varsity</h2>')
    checkAssertion(() => expect(response.text).to.include('<h2>JV</h2>'), 'response includes <h2>JV</h2>')
    checkAssertion(() => expect(response.text).to.include('<img class="mmr-image"'), 'response includes <img class="mmr-image"')
    checkAssertion(() => expect(response.text).to.include('<script src="/scripts/lazyLoadImages.js"></script>'), 'response includes <script src="/scripts/lazyLoadImages.js"></script>')
    checkAssertion(() => expect(response.text).to.match(/<h3>.*<\/h3>/g), 'response includes any <h3> tag')
  })
})
