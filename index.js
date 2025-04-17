// Import packages
import express from 'express'
import bodyParser from 'body-parser'
import potatoes from './routes/potatoes.js'
import home from './routes/home.js'

// Middlewares
const app = express()
app.set('view engine', 'pug')

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', potatoes)
app.use('/', home)

// Connection
const port = process.env.PORT || 9001
app.listen(port, () => console.log(`Listening to port ${port}`))
