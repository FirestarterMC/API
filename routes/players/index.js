const router = require('express').Router();
const db = require('../../models');
const Player = require('../../models/player.js')(db.sequelize, db.DataTypes);

router.get('/', (req, res) => {
    Player.findAll().then(results => {
        res.json(results);
    })
});
router.use('/votes', require('./votes'));
router.get('/:uuid', (req, res) => {
    Player.findOne({
        where: {
            uuid: req.params.uuid
        }
    }).then(results => {
        res.json(results);
    });
});

module.exports = router;
