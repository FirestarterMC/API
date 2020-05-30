require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(require('./routes'));

let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`⚡ Listening on port ${port}.`);
});
