const { Router } = require('express');
require('dotenv').config();
const express = require('express');
const app = express();
const request = require('superagent');
const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;
const uriRedirect = process.env.URI_REDIRECT;
// (put this is a services directory)
// this function takes a code and requests a token from
// the oauth2 provider


// Redirect from '/login' to dropbox oauth site. Then redirects to our URI with auth code which will be traded for barer token and state in url.
module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(`https://www.dropbox.com/oauth2/authorize?client_id=${appKey}&response_type=code&redirect_uri=http://localhost:7890/api/v1/dropbox/oauthredirect`);
  })
// Handle redirect back to our site (with auth code). Exchanges code for barer token. 
  .get('/oauthredirect', (req, res) => {
    const { code } = req.query;
    console.log(code);
    acquireToken(code)
      .then(token => {
        bearerToken(token);
        // do what you need with the token (fetch files, etc)
        console.log(token);
        res.end();
      })
      .catch(console.log);
  });
  
const bearerToken = token => {
  return request
    .post('https://api.dropboxapi.com/2/sharing/list_shared_links',)
    .send({})
    .set('Authorization', `Bearer ${token}`)
    .then(res => console.log(JSON.parse(res.text)));
};
  
//app calls oath2 endpoint to acquire a bearer token using code retrieved from dropbox once the user has authorized the app.
const acquireToken = code => {
  return request
    .post('https://www.dropbox.com/oauth2/token')
    .type('form')
    .send({
      code,
      grant_type: 'authorization_code',
      redirect_uri: uriRedirect,
      client_id: appKey,
      client_secret: appSecret
    })
    .then(res => JSON.parse(res.text).access_token);
};



// app.listen(7890);
