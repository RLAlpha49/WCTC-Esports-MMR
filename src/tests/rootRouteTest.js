/* global describe, it, before */

const request = require('supertest')
const { expect } = require('chai')
const app = require('../Main.js')
const { checkAssertion } = require('./testUtils.js')

describe('Testing the root path', () => {
  let response

  before(async () => {
    response = await request(app).get('/')
  })

  it('It should respond with status code 200', () => {
    checkAssertion(() => expect(response.statusCode).to.equal(200), 'status code is 200')
  })

  it('It should respond with content-type text/html', () => {
    checkAssertion(() => expect(response.headers['content-type']).to.include('text/html'), 'content-type is text/html')
  })

  it('It should include the correct title in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<title>WCTC Esports MMR</title>'), 'response includes <title>WCTC Esports MMR</title>')
  })

  it('It should include the correct h1 in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<h1>WCTC Esports MMR</h1>'), 'response includes <h1>WCTC Esports MMR</h1>')
  })

  it('It should include the welcome message in the response', () => {
    checkAssertion(() => expect(response.text).to.include('Welcome to the WCTC Esports Program website.'), 'response includes the welcome message')
  })

  it('It should include the correct h2 Games in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<h2>Games</h2>'), 'response includes <h2>Games</h2>')
  })

  it('It should include the link to the Rocket League page in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<a href="/rocket-league">Rocket League</a>'), 'response includes the link to the Rocket League page')
  })

  it('It should include the script tag for lazyLoadImages.js in the response', () => {
    checkAssertion(() => expect(response.text).to.include('<script src="/scripts/lazyLoadImages.js"></script>'), 'response includes the script tag for lazyLoadImages.js')
  })
})
