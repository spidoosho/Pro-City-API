var express = require('express');

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("rich-pantyhose-waspCyclicDB")

const leaderboard = db.collection("leaderboard")

var router = express.Router();

async function getLeaderboardFromDB(){
    let leo = await animals.set("leaderboard", [
        { id: 1, name: '1', elo: 1000 },
        { id: 2, name: '2', elo: 2000 },
        { id: 3, name: '3', elo: 3000 }
    ])

    leaderboard = await leaderboard.get("leaderboard")
    return leaderboard
}

router.get('/leaderboard', async function (req, res) {
    //if (leaderboard == null) {
    leaderboard = await getLeaderboardFromDB();
    // } 

    res.json(leaderboard)
});


// get player
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

    res.json({message: "Leaderboard updated.", location: "/leaderboard"});
});

module.exports = router;