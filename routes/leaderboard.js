var express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { ListTablesCommand, ScanCommand, UpdateItemCommand, GetItemCommand, TransactWriteItemsCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb')

var router = express.Router();
const dbclient = new DynamoDBClient({ region: 'eu-north-1' })

async function getLeaderboardFromDB() {
    function comparePlayers (a, b) {
        return parseInt(a.elo.N) - parseInt(b.elo.N)
    }
    
    const leaderboard = []
    const input = { TableName: 'Leaderboard' }
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


router.get('/leaderboard', async function (req, res) {
    leaderboard = await getLeaderboardFromDB();
    res.json(leaderboard)
});

router.get('/leaderboard/text', async function (req, res) {
    leaderboard = await getLeaderboardFromDB();

    if(leaderboard.length < 1) {
        res.json("Leaderboard is empty");
        return;
    }

    let result = `1. ${leaderboard[0].displayName.S} - ${leaderboard[0].elo.N} (${leaderboard[0].gamesWon.N}:${leaderboard[0].gamesLost.N})`

    for(let i = 1; i < Math.min(leaderboard.length, 6); i++) {
        result += `, ${i + 1}. ${leaderboard[i].displayName.S} - ${leaderboard[i].elo.N} (${leaderboard[i].gamesWon.N}:${leaderboard[i].gamesLost.N})`;
    }

    res.json(result)
});


// TODO
router.get('/player/:username(.+)', function (req, res) {
    var currPlayer = leaderboard.filter(player => player.username == req.params.username);

    if (currPlayer.length == 1) {
        res.json(currPlayer[0])
    } else {
        res.status(404);
        res.json({ message: "Not Found" });
    }
});

router.put('/leaderboard', async function (req, res) {
    leaderboard = await getLeaderboardFromDB();

    res.json({ message: "Leaderboard updated.", location: "/leaderboard" });
});

module.exports = router;