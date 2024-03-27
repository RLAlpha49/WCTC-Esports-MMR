const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'WCTC Esports MMR' })
})

module.exports = router
