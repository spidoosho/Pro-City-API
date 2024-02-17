const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { ScanCommand } = require('@aws-sdk/client-dynamodb')
const { LEADERBOARD_TABLE_NAME } = require('./constants.js')

/**
 * Creates a new DynamoDBClient with secrets in .env
 * @returns {DynamoDBClient}
 */
function getClient () {
  return new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
  })
}

/**
 * Gets array of players based on their rating in a descending order
 * @param {DynamoDBClient} dbclient DynamoDB client
 * @returns {Promise<[Object.<string, string>]>}
 */
async function getLeaderboardFromDB (dbclient) {
  /**
   * Custom method for sorting players based on their rating
   * @param {Object.<string, string>} first player dictionary
   * @param {Object.<string, string>} second player dictionary
   * @returns {number} difference of elo
   */
  function comparePlayers (first, second) {
    return parseInt(first.elo.N) - parseInt(second.elo.N)
  }

  const leaderboard = []
  const input = { TableName: LEADERBOARD_TABLE_NAME }
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

  return leaderboard.sort(comparePlayers).reverse()
}

module.exports = { getClient, getLeaderboardFromDB }
