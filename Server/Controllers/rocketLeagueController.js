const axios = require('axios')

const rankDistribution = [
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

// Sample data
const varsityPlayers = [
  { username: 'Alpha49_', mmr3s: 1000, mmr2s: 900, mmr1s: 800 }
  // { username: 'VarsityPlayer2', mmr3s: 1100, mmr2s: 1000, mmr1s: 900 },
  // { username: 'VarsityPlayer3', mmr3s: 1200, mmr2s: 1100, mmr1s: 1000 }
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

async function getRocketLeagueData (req, res) {
  const updatePlayerMMRs = async (players) => {
    for (const player of players) {
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

        player.mmr1s = ranks.find(rank => rank.playlist === 'Duel (Ranked)').mmr
        player.mmr2s = ranks.find(rank => rank.playlist === 'Doubles (Ranked)').mmr
        player.mmr3s = ranks.find(rank => rank.playlist === 'Standard (Ranked)').mmr
      } catch (error) {
        console.error(error)
      }
    }
  }

  await updatePlayerMMRs(varsityPlayers)
  // await updatePlayerMMRs(jvPlayers)
  // await updatePlayerMMRs(jv2Players)

  const addImagePaths = (players) => {
    players.forEach(player => {
      ['mmr3s', 'mmr2s', 'mmr1s'].forEach(mmrKey => {
        const mmr = player[mmrKey]
        const rankInfo = rankDistribution.find(rank => mmr >= rank.mmrMin && mmr <= rank.mmrMax)
        if (rankInfo) {
          player[`${mmrKey}ImagePath`] = imagePathBase + `${rankInfo.rank}.png`
        }
      })
    })
  }

  addImagePaths(varsityPlayers)
  addImagePaths(jvPlayers)
  addImagePaths(jv2Players)

  // Render the 'rocket-league' view with the player data
  res.render('rocket-league', {
    players: {
      varsity: varsityPlayers,
      jv: jvPlayers,
      jv2: jv2Players
    },
    rankDistribution
  })
}

module.exports = getRocketLeagueData
