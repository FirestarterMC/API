const router = require('express').Router();
const db = require('../../../models');
const Player = require('../../../models/player.js')(db.sequelize, db.DataTypes);

router.get('/', (req, res) => {
    Player.findAll({
        attributes: [
            'uuid',
            'votes'
        ],
        order: [
            ['votes', 'DESC']
        ]
    }).then(results => {
        res.json(results);
    });
});
router.get('/top', (req, res) => {
    Player.findAll({
        attributes: [
            'uuid',
            'votes'
        ],
        order: [
            ['votes', 'DESC']
        ],
        limit: 5
    }).then(results => {
        res.json(results);
    })
});

module.exports = router;
