const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dropboxId: {
    type: String,
    required: true
  }
});

const schema = new mongoose.Schema({
  dropboxFolder: {
    type: String,
    required: true
  },
  audioFiles: [audioSchema],
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Dropbox', schema);
