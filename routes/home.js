import { getClient, getPotatoes } from './../src/database.js'
import { Router } from 'express'
import dotenv from 'dotenv'

dotenv.config()
const router = Router()
const dbclient = getClient()

/**
 * Sends a JSON response with a string of a player retrieved based on username
 */
router.get('/', async function (req, res) {
  const hasFound = await getPotatoes(dbclient)

  if (hasFound) {
    res.json('Leaderboard table found. API is ready to use.')
  } else {
    res.json('Could not find Leaderboard table. Please contact the developer.')
  }
})

export default router
