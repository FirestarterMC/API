const router = require('express').Router();
const db = require('../models');
const Player = require('../models/player.js')(db.sequelize, db.DataTypes);

router.get('/', (req, res) => {
    res.json(200, {
        message: '🌠 Everything looks good!'
    });
});
router.use('/players', require('./players'));

module.exports = router;
