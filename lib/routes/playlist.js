const { Router } = require('express');
const Playlist = require('../models/Playlist');
// const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', (req, res, next) => {
    Playlist
      .create(req.body)
      .then(playlist => res.send(playlist))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Playlist
      .findById(req.params.id)
      .then(playlist => res.send(playlist))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Playlist
      .find()
      .then(playlists => res.send(playlists))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Playlist
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(playlist => res.send(playlist))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Playlist
      .findByIdAndDelete(req.params.id)
      .then(playlist => res.send(playlist))
      .catch(next);
  });
