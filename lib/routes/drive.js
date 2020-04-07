const { Router } = require('express');
const Drive = require('../models/Drive');
const ensureAuth = require('../middleware/ensure-auth');
const { OAuth2Client } = require('google-auth-library');
const { ee } = require('../services/google-api');



module.exports = Router()
  .post('/', (req, res, next) => {
    const oAuth = new OAuth2Client(
      process.env.GDRIVECLIENT_ID,
      process.env.GDRIVECLIENT_SECRET,
      `${process.env.GDRIVEREDIRECT_URL}`
    );
    const authorizeUrl = oAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
      state: `driveFolder=${req.query.driveFolder}`
    });
    res.redirect(authorizeUrl);

  })
  .get('/', (req, res, next) => {
    Drive
      .find()
      .then(drives => res.send(drives))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Drive
      .findOne({
        _id: req.params.id,
        userRef: req.user._id
      })
      .populate('userRef')
      .then(drive => res.send(drive))
      .catch(next);
  })
  .put('/:id', ensureAuth, (req, res, next) => {
    Drive
      .findOneAndUpdate({
        _id: req.params.id,
        userRef: req.user._id
      }, { $set: { audioFiles: [] } }, { new: true })
      .then(drive => res.send(drive))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
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
      `${process.env.GDRIVEREDIRECT_URL}`
    );
    const driveFolder = state.split('=')[1];
    oAuth.getToken(code, (err, tokens) => {
      if(err) {
        console.error('Error getting oAuth tokens:');
        throw err;
      }
      oAuth.credentials = tokens;
      Drive
        .createWithAudioFiles(driveFolder, req.user, oAuth)
        .then(drive => res.send(drive))
        .catch(next);      
    });
  });
