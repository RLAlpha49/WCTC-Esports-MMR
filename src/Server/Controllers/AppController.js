const path = require('path')
const express = require('express')
const app = express()
require('dotenv').config()
const indexController = require('./indexController')
const getRocketLeagueData = require('./rocketLeagueController')
const limiter = require('../rateLimiter')

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, '../../public/pages'))

app.use(express.static(path.resolve(__dirname, '../../public')))

app.use('/', limiter, indexController)

app.use('/rocket-league', limiter, getRocketLeagueData)

module.exports = app
