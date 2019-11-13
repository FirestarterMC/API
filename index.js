const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
/*const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DB, process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    });
*/

const port = process.env.PORT || 8080
const router = express.Router()

const Player = require('./models/player')

app.use(session({secret: process.env.SECRET}))
app.use(bodyParser.json())
app.use('/api', router)

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

// Authorization endpoint
router.route('/authorize').get((req, res) => {
    const body = req.body
    if (Object.keys(body).length < 1) {
        res.status(400).json({
            "message": "No body."
        })
        return
    }

    if (body['uuid'] === undefined) {
        res.status(400).json({
            "message": "No UUID."
        })
        return
    }

    // TODO check if UUID is valid
    const uuid = 'facb6ce6-338c-4bad-981d-e3b24b3453f6'
    res.status(200).redirect(`https://discordapp.com/api/oauth2/authorize?client_id=619754624257228800&redirect_uri=http%3A%2F%2Fdd2f8c24.ngrok.io%2Fauthorize&response_type=code&scope=identify`)
})

router.route('/authorize').post((req, res) => {
    console.log(req.query.uuid)
    console.log(req.body)
})

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.listen(port, () => {
    console.log(`⚡ Listening on port ${port}.`)
})
