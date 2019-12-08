const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServiceSchema = new Schema({
    uuid: String,
    joined: Number,
    playtime: Number,
    deaths: Number,
    votes: Number,
})

module.exports = mongoose.model('Service', ServiceSchema, "services")