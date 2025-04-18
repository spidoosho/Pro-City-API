import { getClient, getPotatoes } from './../src/database.js'
import { Router } from 'express'
import dotenv from 'dotenv'

dotenv.config()
const router = Router()

/**
 * Sends a JSON response with a string of a player retrieved based on username
 */
router.get('/healthcheck', async function (req, res) {
  res.json('Ready')
})

export default router
