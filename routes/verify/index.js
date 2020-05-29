const router = require('express').Router();
const session = require('express-session');
const axios = require('axios');
const qs = require('qs');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS);
const db = require('../../models');
const Player = require('../../models/player.js')(db.sequelize, db.DataTypes);

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// TODO detection if you are already linked

router.get('/auth', (req, res) => {
    let code = req.query.code, token = req.session.token;

    if (code === undefined || token === undefined) {
        res.status(400).json({message: 'Bad Request.'});
        return;
    }

    axios.post('https://discord.com/api/v6/oauth2/token', qs.stringify({
        'client_id': '619754624257228800',
        'client_secret': process.env.CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'https://api.firestartermc.com/verify/auth',
        'scope': 'identify guilds guilds.join'
    }), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then((response) => {
        axios.get("https://discordapp.com/api/users/@me", {
            headers: {"Authorization": `Bearer ${response.data.access_token}`}
        }).then((response) => {
            return response.data.id;
        }).then((id) => {
            client.hget("discord", token, (err, result) => {
                if (result === null) {
                    res.status(400).json({message: 'Bad Request.'});
                    return;
                }

                Player.update({discord: id}, {
                    where: {uuid: result}
                }).then(() => {
                    client.hdel("discord", token);

                    axios.put(`https://discordapp.com/api/guilds/609452308161363995/members/${id}`, {
                        'access_token': response.data.access_token
                    }, {
                        headers: {
                            "Authorization": `Bot ${process.env.BOT_TOKEN}`,
                            "Content-Type": "application/json"
                        }
                    }).then(response => {
                        if (response.status === 204) {
                            res.status(200).send("You're already in the server and your account is linked. " +
                                "Contact a staff member if this is a mistake.");
                        } else {
                            res.status(200).send("You've been added to the Discord server and your account has been verified. " +
                                "You can now close this window.");
                        }
                    });
                }).catch((err) => {
                    res.status(500).json({message: 'Internal Server Error.'});
                    console.error(err);
                });
            })
        });
    }).catch(() => {
        res.status(400).json({message: 'Bad Request.'});
    })
});

router.get('/:token', (req, res) => {
    client.hget("discord", req.params.token, (err, result) => {
        if (err) {
            res.status(500).json({message: 'Internal Server Error.'})
        } else {
            if (result === null) {
                res.status(400).json({message: "Bad Request."})
            } else {
                req.session.token = req.params.token;
                res.redirect(process.env.OAUTH_REDIRECT)
            }
        }
    });
});

module.exports = router;
