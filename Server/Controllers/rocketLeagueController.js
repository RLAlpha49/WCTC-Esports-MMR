const axios = require('axios')
const moment = require('moment')
const db = global.db

const rankDistribution1s = [
  { rank: 'Bronze_I', mmrMin: 109, mmrMax: 144 },
  { rank: 'Bronze_II', mmrMin: 155, mmrMax: 215 },
  { rank: 'Bronze_III', mmrMin: 216, mmrMax: 274 },
  { rank: 'Silver_I', mmrMin: 275, mmrMax: 334 },
  { rank: 'Silver_II', mmrMin: 335, mmrMax: 394 },
  { rank: 'Silver_III', mmrMin: 395, mmrMax: 454 },
  { rank: 'Gold_I', mmrMin: 455, mmrMax: 514 },
  { rank: 'Gold_II', mmrMin: 515, mmrMax: 574 },
  { rank: 'Gold_III', mmrMin: 575, mmrMax: 634 },
  { rank: 'Platinum_I', mmrMin: 635, mmrMax: 694 },
  { rank: 'Platinum_II', mmrMin: 695, mmrMax: 754 },
  { rank: 'Platinum_III', mmrMin: 755, mmrMax: 814 },
  { rank: 'Diamond_I', mmrMin: 815, mmrMax: 874 },
  { rank: 'Diamond_II', mmrMin: 875, mmrMax: 934 },
  { rank: 'Diamond_III', mmrMin: 935, mmrMax: 994 },
  { rank: 'Champion_I', mmrMin: 995, mmrMax: 1054 },
  { rank: 'Champion_II', mmrMin: 1055, mmrMax: 1114 },
  { rank: 'Champion_III', mmrMin: 1115, mmrMax: 1174 },
  { rank: 'Grand_Champion_I', mmrMin: 1175, mmrMax: 1224 },
  { rank: 'Grand_Champion_II', mmrMin: 1225, mmrMax: 1294 },
  { rank: 'Grand_Champion_III', mmrMin: 1295, mmrMax: 1347 },
  { rank: 'Supersonic_Legend', mmrMin: 1348, mmrMax: null }
];

const rankDistribution2s3s = [
  { rank: 'Bronze_I', mmrMin: 100, mmrMax: 171 },
  { rank: 'Bronze_II', mmrMin: 172, mmrMax: 234 },
  { rank: 'Bronze_III', mmrMin: 235, mmrMax: 294 },
  { rank: 'Silver_I', mmrMin: 295, mmrMax: 354 },
  { rank: 'Silver_II', mmrMin: 355, mmrMax: 414 },
  { rank: 'Silver_III', mmrMin: 415, mmrMax: 474 },
  { rank: 'Gold_I', mmrMin: 475, mmrMax: 534 },
  { rank: 'Gold_II', mmrMin: 535, mmrMax: 594 },
  { rank: 'Gold_III', mmrMin: 595, mmrMax: 654 },
  { rank: 'Platinum_I', mmrMin: 655, mmrMax: 714 },
  { rank: 'Platinum_II', mmrMin: 715, mmrMax: 774 },
  { rank: 'Platinum_III', mmrMin: 775, mmrMax: 834 },
  { rank: 'Diamond_I', mmrMin: 835, mmrMax: 914 },
  { rank: 'Diamond_II', mmrMin: 915, mmrMax: 994 },
  { rank: 'Diamond_III', mmrMin: 995, mmrMax: 1074 },
  { rank: 'Champion_I', mmrMin: 1075, mmrMax: 1194 },
  { rank: 'Champion_II', mmrMin: 1195, mmrMax: 1314 },
  { rank: 'Champion_III', mmrMin: 1315, mmrMax: 1434 },
  { rank: 'Grand_Champion_I', mmrMin: 1435, mmrMax: 1575 },
  { rank: 'Grand_Champion_II', mmrMin: 1576, mmrMax: 1704 },
  { rank: 'Grand_Champion_III', mmrMin: 1705, mmrMax: 1876 },
  { rank: 'Supersonic_Legend', mmrMin: 1877, mmrMax: null }
]

const imagePathBase = '/images/RL-Ranks/'

async function getRocketLeagueData (req, res) {
  const updatePlayerMMRs = async (players) => {
    for (const player of players) {
      // Check if player exists in mmr.rocketleague
      const playerExists = await db.query('SELECT * FROM mmr.rocketleague WHERE username = $1', [player.username])

      if (playerExists.rows.length > 0) {
        const lastUpdated = moment(playerExists.rows[0].last_updated)
        const oneDayAgo = moment().subtract(24, 'hours')

        console.log(`Player ${player.username} last updated: ${lastUpdated}`)
        console.log(`One day ago: ${oneDayAgo}`)

        const isUpToDate = lastUpdated.isAfter(oneDayAgo)
        console.log(`Player ${player.username} data is up-to-date: ${isUpToDate}`)

        // If player exists and data is up-to-date, skip the API request
        if (isUpToDate) {
          console.log(`Skipping API request for player ${player.username}`)
          player.mmr1s = playerExists.rows[0].mmr1s
          player.mmr2s = playerExists.rows[0].mmr2s
          player.mmr3s = playerExists.rows[0].mmr3s
          continue
        }
      }

      console.log(`Making API request for player ${player.username}`)

      const options = {
        method: 'GET',
        url: `https://rocket-league1.p.rapidapi.com/ranks/${player.username}`,
        headers: {
          'User-Agent': 'RapidAPI Playground',
          'Accept-Encoding': 'identity',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'rocket-league1.p.rapidapi.com'
        }
      }

      try {
        const response = await axios.request(options)
        const ranks = response.data.ranks

        console.log(`API response for player ${player.username}:`, ranks)

        player.mmr1s = ranks.find(rank => rank.playlist === 'Duel (Ranked)').mmr
        player.mmr2s = ranks.find(rank => rank.playlist === 'Doubles (Ranked)').mmr
        player.mmr3s = ranks.find(rank => rank.playlist === 'Standard (Ranked)').mmr

        console.log(`Updated player object for ${player.username}:`, player)

        if (playerExists.rows.length === 0) {
          // Insert player data into mmr.rocketleague
          await db.query('INSERT INTO mmr.rocketleague (playerid, username, mmr1s, mmr2s, mmr3s) VALUES ($1, $2, $3, $4, $5)', [player.playerid, player.username, player.mmr1s, player.mmr2s, player.mmr3s])
        } else {
          // Update player data in mmr.rocketleague
          await db.query('UPDATE mmr.rocketleague SET mmr1s = $1, mmr2s = $2, mmr3s = $3 WHERE username = $4', [player.mmr1s, player.mmr2s, player.mmr3s, player.username])
        }

        // Update last_updated in players.rocketleague
        await db.query('UPDATE players.rocketleague SET last_updated = $1 WHERE username = $2', [new Date(), player.username])
      } catch (error) {
        console.error(error)
      }
    }
    return players
  }

  // Select all current players from players.all
  const playersAll = await db.query('SELECT * FROM players.all WHERE status = $1', ['current'])

  // Select all players from players.rocketleague
  const playersRocketLeague = await db.query('SELECT * FROM players.rocketleague')

  // Merge the two player arrays
  let players = Array.isArray(playersAll.rows)
    ? playersAll.rows.map(playerAll => {
      const playerRocketLeague = playersRocketLeague.rows.find(playerRocketLeague => playerRocketLeague.username === playerAll.username)
      return {
        ...playerAll,
        team: playerRocketLeague ? playerRocketLeague.team : 'no team'
      }
    })
    : []
  console.log(players)

  players = await updatePlayerMMRs(players)
  console.log(players)

  const addImagePaths = (players) => {
    players.forEach(player => {
      const mmrKeys = ['mmr3s', 'mmr2s', 'mmr1s']
      const rankDistributions = [rankDistribution2s3s, rankDistribution2s3s, rankDistribution1s]
      mmrKeys.forEach((mmrKey, index) => {
        const mmr = player[mmrKey]
        const rankInfo = rankDistributions[index].find(rank => mmr >= rank.mmrMin && mmr <= rank.mmrMax)
        if (rankInfo) {
          player[`${mmrKey}ImagePath`] = imagePathBase + `${rankInfo.rank}.png`
        }
      })
    })
  }

  addImagePaths(players)

  // Group players by team
  const groupedPlayers = ['varsity', 'jv', 'jv2'].reduce((grouped, team) => {
    grouped[team] = players.filter(player => player.team.toLowerCase() === team)
    return grouped
  }, {})

  // Render the 'rocket-league' view with the player data
  res.render('rocket-league', {
    players: groupedPlayers,
    rankDistribution1s,
    rankDistribution2s3s
  })
}

module.exports = getRocketLeagueData
