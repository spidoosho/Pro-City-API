const { getClient, getLeaderboardFromDB } = require('./../src/database.js')
const express = require('express')
require('dotenv').config()

const router = express.Router()
const dbclient = getClient()

/**
 * Sends a JSON response with a string of a player retrieved based on username
 */
router.get('/player/:username', async function (req, res) {
  const player = await getPlayerDataFromDb(dbclient, req.params.username)
  const playerStr = `${player.displayName.S} - ${player.elo.N} (${player.gamesWon.N}: ${player.gamesLost.N})`
  res.json(playerStr)
})

/**
 * Retrieves player data based on player name
 * @param {DynamoDBClient} dbclient DynamoDB client
 * @param {string} name player display name
 * @returns {Promise<Object.<string, string>} player data
 */
async function getPlayerDataFromDb (dbclient, name) {
  const leaderboard = await getLeaderboardFromDB(dbclient)
  return leaderboard.find((player) => player.displayName.S === name)
}

module.exports = router
