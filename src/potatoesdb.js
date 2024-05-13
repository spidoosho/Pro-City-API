const { ScanCommand } = require('@aws-sdk/client-dynamodb')

async function getPotatoesFromDb (dbclient) {
  /**
     * Custom method for sorting players based on their rating
     * @param {Object.<string, string>} first player dictionary
     * @param {Object.<string, string>} second player dictionary
     * @returns {number} difference of elo
     */

  const leaderboard = []
  const input = { TableName: 'Potatoes', ProjectionExpression: 'Nazev, Mnozstvi, Datum, Objednavka' }
  let scan = await dbclient.send(new ScanCommand(input))

  // if one scan is not enough, then scan until retrieved all items
  // if LastEvaluatedKey is undefined, then all items have been retrieved
  while (scan.LastEvaluatedKey !== undefined) {
    // LastEvaluatedKey is defined, ergo scan found items
    scan.Items.forEach(function (item, index) {
      leaderboard.push(item)
    })

    input.ExclusiveStartKey = scan.LastEvaluatedKey
    scan = await dbclient.send(new ScanCommand(input))
  }

  if (scan.Items !== undefined) {
    scan.Items.forEach(function (item, index) {
      leaderboard.push(item)
    })
  }

  return leaderboard
}

module.exports = { getPotatoesFromDb }
