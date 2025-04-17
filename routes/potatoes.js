import { getClient, getLastUpdate, getPotatoes } from './../src/database.js'
import { Router } from 'express'
import { promises as fs } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()
const dbclient = getClient()

router.get('/', async function (req, res) {
  const potatoes = await getPotatoes(dbclient)
  const lastUpdate = formatDate(await getLastUpdate(dbclient))
  const sum = getPotatoesSum(potatoes)
  res.render('index', {
    objednavky: potatoes,
    sum,
    lastUpdate
  })
})

function getPotatoesSum (potatoes) {
  let result = 0
  for (const order of potatoes) {
    const numericPart = order.Mnozstvi.replace(/[^ 0-9]/g, '')
    if (numericPart && parseInt(numericPart)) {
      result += parseInt(numericPart)
    }
  }
  return result
}

function formatDate (str) {
  const date = new Date(str);

  return date.toLocaleString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', '');
}

router.post('/potatoes/update', async (req, res) => {
  try {
    await fs.writeFile('data.txt', JSON.stringify(req.body))
    res.send('POST request to update potatoes done.')
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating potatoes')
  }
})

export default router
