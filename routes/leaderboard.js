var express = require('express');
var nextServer = require('next/server');
var vercelEdge = require('@vercel/edge-config');

var router = express.Router();

var leaderboard = null;

async function getLeaderboardFromDB(){
    const leaderboard = await vercelEdge.get('leaderboard');
    return nextServer.NextResponse.json(leaderboard);
}

router.get('/leaderboard', async function (req, res) {
    if (leaderboard == null) {
        leaderboard = await getLeaderboardFromDB();
    } 

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