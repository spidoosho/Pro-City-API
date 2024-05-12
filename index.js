// Import packages
const express = require('express')
const leaderboard = require('./routes/leaderboard.js')
const player = require('./routes/players.js')
const home = require('./routes/home.js')

// Middlewares
const app = express()
app.use(express.json())

// Routes
app.use('/', leaderboard)
app.use('/', player)
app.use('/', home)

// Connection
console.log(process.env.REGION)
console.log(process.env.ACCESS_KEY)
console.log(process.env.SECRET_ACCESS_KEY)
const port = process.env.PORT || 9001
app.listen(port, () => console.log(`Listening to port ${port}`))
