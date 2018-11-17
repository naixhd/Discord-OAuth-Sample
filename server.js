const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser')
const { catchAsync } = require('./utils');
const fetch = require('node-fetch');

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());



app.get('/', catchAsync(async (req, res) => {
    var request = require('request');
    var token = req.cookies['otoken'];
    if(!token)
        return res.status(200).render("index.ejs");
      const response = await fetch(`http://discordapp.com/api/users/@me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const json = await response.json();
    res.status(200).render("index.ejs", {"name":json.username});
  }));

app.listen(1337, () => {
    console.info('Running on port 1337');
  });

  app.use('/api/discord', require('./api/discord'));


  app.use((err, req, res, next) => {
    switch (err.message) {
      case 'NoCodeProvided':
        return res.status(400).send({
          status: 'ERROR',
          error: err.message,
        });
      default:
        return res.status(500).send({
          status: 'ERROR',
          error: err.message,
        });
    }
  });