const { Router } = require('express');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .get('/friend-folders', (req, res, next) => {
    User
      .friendFolders()
      .then(user => res.send(user))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .populate({ 
        path: 'drives'
      })
      .then(user => res.send(user))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    User
      .find()
      .populate({ 
        path: 'drives'
      })
      .then(user => res.send(user))
      .catch(next);
  })
  .put('/:name', ensureAuth, (req, res, next) => { 
    User
      .addFriend(req.params.name, req.user._id)
      .then(user => res.send(user))
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    User
      .findOneAndUpdate({
        _id: req.params.id
      }, req.body, { new: true })
      .then(user => res.send(user))
      .catch(next);
  });
