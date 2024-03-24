const chalk = require('chalk')

let hasFailures = false

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

module.exports = {
  checkAssertion,
  hasFailures
}
