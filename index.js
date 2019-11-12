const express = require('express')
const app = express()
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const port = process.env.PORT || 8080
const router = express.Router()

const Player = require('./models/player')

app.use('/api', router)
app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())

router.use((req, res, next) => {
    console.log(`🎺 Request from ${req.hostname}.`)
    next()
})

router.get('/', (req, res) => {
    res.json({message: 'woo, an API!'})
})

router.route('/players').get((req, res) => {
    Player.find((err, players) => {
        if (err) res.send(err)
        res.json(players)
    })
})

router.route('/player/:uuid').get((req, res) => {
    Player.find({'uuid': req.params.uuid}, (err, player) => {
        if (err) res.send(err)
        res.send(player)
    })
})

dotenv.config()
mongoose.connect(process.env.MONGO_URI)
app.listen(port, () => {
    console.log(`⚡ Listening on port ${port}.`)
})
