var express = require('express');
var db = require('cyclic-s3');

const BUCKET_STR = "cyclic-rich-pantyhose-wasp-eu-west-2"

var router = express.Router();
db.loadDB(BUCKET_STR);

async function getLeaderboardFromDB() {
    let leaderboard = []

    try {
        leaderboard = db.get("leaderboard");
    } catch (e) {
        if (!(e.code == 'NoSuchKey')) {
            throw e;
        }

        db.set("leaderboard", leaderboard)
    }

    return leaderboard
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

    let result = `1. ${leaderboard[0].name} - ${leaderboard[0].elo}RR`;

    for(let i = 1; i < Math.min(leaderboard.length, 6); i++) {
        result += `, ${i + 1}. ${leaderboard[i].name} - ${leaderboard[i].elo}RR`
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