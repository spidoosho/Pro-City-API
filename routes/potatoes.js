import { getClient, getPotatoes } from './../src/database.js'
import { Router } from 'express'
import { promises as fs } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()
const dbclient = getClient()

router.get('/potatoes', async function (req, res) {
  const potatoes = await getPotatoes(dbclient)
  console.log(JSON.stringify(potatoes))
  //const sum = getPotatoesSum(potatoes)
  res.render('index', {
    objednavky: potatoes,
    sum:1,
    lastUpdate:2
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

async function getPotatoesFromFile () {
  const jsonString = await fs.readFile('data.txt', 'utf8')
  const data = JSON.parse(jsonString)
  const result = []

  if ('Datum' in data) {
    for (let i = 0; i < data.Datum.length; i++) {
      result.push({
        Datum: data.Datum[i],
        Mnozstvi: data.Mnozstvi[i],
        Nazev: data.Nazev[i],
        Objednavka: data.Objednavka[i]
      })
    }
  }
  return [data.LastUpdate, result]
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
