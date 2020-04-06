const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

const oneDay = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), {
          maxAge: oneDay,
          httpOnly: true
        });
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authorize(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), {
          maxAge: oneDay,
          httpOnly: true
        });
        res.send(user);
      })
      .catch(next);
  })
  
  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  });
