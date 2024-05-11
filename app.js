const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();

app.use(bodyParser.json());
app.get('/ping', (req, res) => {
    res.send('pongok');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});