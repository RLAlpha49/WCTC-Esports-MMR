/* global describe, it, before */

const request = require('supertest')
const { expect } = require('chai')
const app = require('../Main.js')
const { checkAssertion } = require('../tests/testUtils.js')

describe('Testing the /rocket-league route', () => {
  let response

  before(async function () {
    this.timeout(5000)
    response = await request(app).get('/rocket-league')
  })

  it('It should respond with status code 200', () => {
    checkAssertion(() => expect(response.statusCode).to.equal(200), 'status code is 200')
  })

  it('It should respond with content-type text/html', () => {
    checkAssertion(() => expect(response.headers['content-type']).to.include('text/html'), 'content-type is text/html')
  })

  it('It should include the correct title in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<title>WCTC Esports Program - Rocket League</title>'), 'response includes <title>WCTC Esports Program - Rocket League</title>')
  })

  it('It should include the correct h1 in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<h1>Rocket League MMR</h1>'), 'response includes <h1>Rocket League MMR</h1>')
  })

  it('It should include the correct h2 Varsity in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<h2>Varsity</h2>'), 'response includes <h2>Varsity</h2>')
  })

  it('It should include the correct h2 JV in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<h2>JV</h2>'), 'response includes <h2>JV</h2>')
  })

  it('It should include the correct img class in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<img class="mmr-image"'), 'response includes <img class="mmr-image"')
  })

  it('It should include the correct script in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<script src="/scripts/lazyLoadImages.js"></script>'), 'response includes <script src="/scripts/lazyLoadImages.js"></script>')
  })

  it('It should include any h3 tag in the response', () => {
    checkAssertion(() => expect(response.text).to.match(/<h3>.*<\/h3>/g), 'response includes any <h3> tag')
  })
})
