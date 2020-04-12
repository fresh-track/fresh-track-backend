const { Router } = require('express');
const Drive = require('../models/Drive');
const ensureAuth = require('../middleware/ensure-auth');
const { getAuthUrl, getAuth } = require('../services/google-api');

module.exports = Router()
  .get('/add', ensureAuth, (req, res) => {
    res.send(getAuthUrl('create'));
  })
  
  .get('/all', (req, res, next) => {
    Drive
      .find()
      .populate({ 
        path: 'userRef'
      })
      .then(drives => res.send(drives))
      .catch(next);
  })

  .get('/one/:id', ensureAuth, (req, res, next) => {
    Drive
      .findOne({
        _id: req.params.id,
        userRef: req.user._id
      })
      .populate('userRef')
      .then(drive => res.send(drive))
      .catch(next);
  })

  .get('/update/:id', ensureAuth, (req, res) => {
    res.send(getAuthUrl('update'));
  })

  .delete('/remove/:id', ensureAuth, (req, res, next) => {
    Drive 
      .findOneAndDelete({
        _id: req.params.id,
        userRef: req.user._id
      })
      .then(drive => res.send(drive))
      .catch(next);
  })

  .get('/oauth2/callback', (req, res, next) => {
    const { code, state } = req.query;
    // split and destructure to get values
    const [callType, folderAndUser] = state.split('=');
    const [driveFolder, userId] = folderAndUser.split('&');
    getAuthUrl(code)
      .then(auth => Drive
        .handleCallType(callType, driveFolder, userId, auth))
      .then(() => res.redirect('https://fresh-track.netlify.com/profile'))
      .catch(next); // pass errors to next so the front-end can react
  });
