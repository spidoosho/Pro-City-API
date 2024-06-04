const { BatchWriteItemCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb')
const { getClient } = require('./../src/database.js')
const { getPotatoesFromDb } = require('./../src/potatoesdb.js')
const fs = require('fs')
const express = require('express')
require('dotenv').config()

const router = express.Router()
const dbclient = getClient()

router.get('/potatoes', async function (req, res) {
  const [lastUpdate, potatoes] = await getPotatoesFromFile(dbclient)
  console.log(JSON.stringify(potatoes))
  const sum = getPotatoesSum(potatoes)
  res.render('index', { objednavky: potatoes, sum, lastUpdate })
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
  const jsonString = fs.readFileSync('data.txt')
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
  // await ClearTable()
  fs.writeFile('data.txt', JSON.stringify(req.body), function (err) {
    if (err) {
      console.log(err)
    }
  })

  res.send('POST request to update potatoes done.')
})

module.exports = router
