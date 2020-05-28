const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv');

const app = express();
env.config();

app.use(cors());
app.use(bodyParser.json());
app.use(require('./routes'));

let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`⚡ Listening on port ${port}.`);
});
