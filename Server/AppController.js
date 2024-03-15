const path = require('path');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/index.html'));
});

app.get('/rocket-league', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/rocket-league.html'));
});

module.exports = app;