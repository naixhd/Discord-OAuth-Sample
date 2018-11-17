const express = require('express')
    , cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');

const router = express.Router();

const CLIENT_ID = "418472586553589804";
const CLIENT_SECRET = "_FrctukfJpRxk4anPWNONtq9lRgelILf";
const redirect = encodeURIComponent('http://localhost:1337/api/discord/callback');

router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=418472586553589804&redirect_uri=http%3A%2F%2Flocalhost%3A1337%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify`);
  });


  router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
        },
      });
    const json = await response.json();
    let options = {
        maxAge: 1000 * 60 * 60 * 24 * 15, // would expire after 15 Days
        httpOnly: true
    }
    res.cookie('otoken', json.access_token, options);
    res.redirect(`/`);
  }));  


module.exports = router;
