const { ScanCommand } = require('@aws-sdk/client-dynamodb')

async function getPotatoesFromDb (dbclient) {
  /**
     * Custom method for sorting players based on their rating
     * @param {Object.<string, string>} first player dictionary
     * @param {Object.<string, string>} second player dictionary
     * @returns {number} difference of elo
     */

  const potatoes = []
  let lastUpdate
  const input = { TableName: 'Potatoes', ProjectionExpression: 'Nazev, Mnozstvi, Datum, Objednavka, LastUpdate' }
  let scan = await dbclient.send(new ScanCommand(input))

  // if one scan is not enough, then scan until retrieved all items
  // if LastEvaluatedKey is undefined, then all items have been retrieved
  while (scan.LastEvaluatedKey !== undefined) {
    // LastEvaluatedKey is defined, ergo scan found items
    scan.Items.forEach(async function (item, index) {
      if ('LastUpdate' in item) {
        lastUpdate = item.LastUpdate.S
      } else {
        potatoes.push(item)
      }
    })

    input.ExclusiveStartKey = scan.LastEvaluatedKey
    console.log('ScanCommand===================================')
    scan = await dbclient.send(new ScanCommand(input))
    console.log(JSON.stringify(scan))
    console.log('==============================================')
  }

  if (scan.Items !== undefined) {
    scan.Items.forEach(async function (item, index) {
      if ('LastUpdate' in item) {
        lastUpdate = item.LastUpdate.S
      } else {
        potatoes.push(item)
      }
    })
  }

  return [lastUpdate, potatoes]
}

module.exports = { getPotatoesFromDb }
