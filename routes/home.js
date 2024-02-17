const { getClient, isLeaderboardTableFound } = require('./../src/database.js')
const { Router } = require('express')

require('dotenv').config()
const router = Router()
const dbclient = getClient()

/**
 * Sends a JSON response with a string of a player retrieved based on username
 */
router.get('/', async function (req, res) {
  const hasFound = await isLeaderboardTableFound(dbclient)

  if (hasFound) {
    res.json('Leaderboard table found. API is ready to use.')
  } else {
    res.json('Could not find Leaderboard table. Please contact the developer.')
  }
})

module.exports = router
