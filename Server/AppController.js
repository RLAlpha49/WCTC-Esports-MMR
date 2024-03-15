const path = require('path')
const express = require('express')
const app = express()
const axios = require('axios')
require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../public/pages'))

// Sample data
const varsityPlayers = [
  { username: 'VarsityPlayer1', mmr3s: 1000, mmr2s: 900, mmr1s: 800 },
  { username: 'VarsityPlayer2', mmr3s: 1100, mmr2s: 1000, mmr1s: 900 },
  { username: 'VarsityPlayer3', mmr3s: 1200, mmr2s: 1100, mmr1s: 1000 }
]

const jvPlayers = [
  { username: 'JVPlayer1', mmr3s: 1000, mmr2s: 900, mmr1s: 800 },
  { username: 'JVPlayer2', mmr3s: 1100, mmr2s: 1000, mmr1s: 900 },
  { username: 'JVPlayer3', mmr3s: 1200, mmr2s: 1100, mmr1s: 1000 }
]

const jv2Players = [
  { username: 'JV2Player1', mmr3s: 1000, mmr2s: 900, mmr1s: 800 },
  { username: 'JV2Player2', mmr3s: 1100, mmr2s: 1000, mmr1s: 900 },
  { username: 'JV2Player3', mmr3s: 1200, mmr2s: 1100, mmr1s: 1000 }
]

app.use(express.static(path.join(__dirname, '../public/pages'))) // Serve static files

app.get('/rocket-league', (req, res) => {
  // Check if the API key is defined
  if (!process.env.TRN_API_KEY) {
    console.error('API key is not defined. Please check your .env file.')
    return
  }

  const url = 'https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/76561198279212437'

  axios.get(url, {
    headers: {
      'TRN-Api-Key': process.env.TRN_API_KEY
    }
  })
    .then(response => {
      // The data from the API will be in response.data
      const data = response.data

      // Check if the segments exist in the response data
      if (!data.segments) {
        console.error('Segments do not exist in the response data. Please check the API endpoint and the structure of the response data.')
        return
      }

      // Extract the MMRs
      const mmr3sSegment = data.segments.find(segment => segment.attributes.name === '3s')
      const mmr2sSegment = data.segments.find(segment => segment.attributes.name === '2s')
      const mmr1sSegment = data.segments.find(segment => segment.attributes.name === '1s')

      // Check if the segments for the 3 playlists exist
      if (!mmr3sSegment || !mmr2sSegment || !mmr1sSegment) {
        console.error('One or more segments for the 3 playlists do not exist. Please check the API endpoint and the structure of the response data.')
        return
      }

      const mmr3s = mmr3sSegment.attributes.mmr
      const mmr2s = mmr2sSegment.attributes.mmr
      const mmr1s = mmr1sSegment.attributes.mmr

      console.log(`3s MMR: ${mmr3s}`)
      console.log(`2s MMR: ${mmr2s}`)
      console.log(`1s MMR: ${mmr1s}`)

      // Render the 'rocket-league' view with the player data
      res.render('rocket-league', { varsityPlayers, jvPlayers, jv2Players })
    })
    .catch(error => {
      console.error(error)
    })
})

module.exports = app
