var express = require('express');

const AWS = require("aws-sdk");
const s3 = new AWS.S3()

var router = express.Router();

async function getLeaderboardFromDB() {
    let leaderboard = []

    try {
        leaderboard = await s3.getObject({
            Bucket: "cyclic-rich-pantyhose-wasp-eu-west-2",
            Key: "leaderboard"
        }).promise()

        leaderboard = JSON.parse(leaderboard.Body.toString('utf-8'));
    } catch (e) {   
        if (!(e.code == 'NoSuchKey')) {
            throw e;
        }
        
        await s3.putObject({
            Body: JSON.stringify(leaderboard),
            Bucket: "cyclic-rich-pantyhose-wasp-eu-west-2",
            Key: "leaderboard",
        }).promise()
    }

    return leaderboard
}

router.get('/leaderboard', async function (req, res) {
    leaderboard = await getLeaderboardFromDB();
    res.json(leaderboard)
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