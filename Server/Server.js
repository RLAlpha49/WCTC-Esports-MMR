const express = require('express');
const app = express();
const port = 3000;
const appController = require('./appController');

app.use('/', appController);
app.use(express.static('public'));
app.use(express.static('public/pages'));

function start() {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = { start };