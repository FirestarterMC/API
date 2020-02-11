const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayerSchema = new Schema({
    _id: String,
    joined: Number,
    playtime: Number,
    votes: Number,
})

module.exports = mongoose.model('Player', PlayerSchema, "players")