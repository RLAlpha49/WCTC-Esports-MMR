const path = require('path')
const express = require('express')
const app = express()
require('dotenv').config()
const getRocketLeagueData = require('./rocketLeagueController')

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, '../../public/pages'))

app.use(express.static(path.resolve(__dirname, '../../public')))

app.get('/rocket-league', getRocketLeagueData)

module.exports = app
