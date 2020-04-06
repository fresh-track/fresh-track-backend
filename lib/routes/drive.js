const { Router } = require('express');
const Drive = require('../models/Drive');

module.exports = Router()

  .post('/', (req, res, next) => {
    Drive
      .create(req.body)
      .then(drive => res.send(drive))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Drive
      .topRatings()
      .then(drives => res.send(drives))
      .catch(next);
  })
  
  .delete('/:id', (req, res, next) => {
    Drive 
      .findByIdAndDelete(req.params.id)
      .then(drive => res.send(drive))
      .catch(next);
  });
