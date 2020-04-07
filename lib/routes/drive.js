const { Router } = require('express');
const Drive = require('../models/Drive');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Drive
      .create({ 
        ...req.body, 
        userRef: req.user._id 
      })
      .then(drive => res.send(drive))
      .catch(next);
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
  });
