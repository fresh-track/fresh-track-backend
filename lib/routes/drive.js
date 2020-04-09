const { Router } = require('express');
const Drive = require('../models/Drive');
const ensureAuth = require('../middleware/ensure-auth');
const { OAuth2Client } = require('google-auth-library');
const opn = require('open');

module.exports = Router()
  .get('/add', ensureAuth, (req, res) => {
    const oAuth = new OAuth2Client(
      process.env.GDRIVECLIENT_ID,
      process.env.GDRIVECLIENT_SECRET,
      process.env.GDRIVEREDIRECT_URL
    );
    const authorizeUrl = oAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
      state: `create=${req.query.driveFolder}&${req.user._id}`
    });
    res.redirect(authorizeUrl);
    opn(authorizeUrl);
  })
  .get('/all', (req, res, next) => {
    Drive
      .find()
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
    const oAuth = new OAuth2Client(
      process.env.GDRIVECLIENT_ID,
      process.env.GDRIVECLIENT_SECRET,
      `${process.env.GDRIVEREDIRECT_URL}`
    );
    const authorizeUrl = oAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
      state: `update=${req.params.id}&${req.user._id}`
    });
    res.redirect(authorizeUrl);
    opn(authorizeUrl);
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
    const oAuth = new OAuth2Client(
      process.env.GDRIVECLIENT_ID,
      process.env.GDRIVECLIENT_SECRET,
      process.env.GDRIVEREDIRECT_URL
    );
    const folderAndUser = state.split('=')[1];
    const callType = state.split('=')[0];
    const driveFolder = folderAndUser.split('&')[0];
    const userId = folderAndUser.split('&')[1];
    oAuth.getToken(code, (err, tokens) => {
      if(err) {
        console.error('Error getting oAuth tokens:');
        throw err;
      }
      oAuth.credentials = tokens;
      if(callType === 'create') {
        Drive
          .createWithAudioFiles(driveFolder, userId, oAuth)
          .then(drive => res.send(drive))
          .catch(next);    
      } else if(callType === 'update') {
        Drive
          .updateAudioFiles(driveFolder, userId, oAuth)
          .then(drive => res.send(drive))
          .catch(next);   
      }
    });
  });
