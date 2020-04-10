const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  songName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  }
});

const schema = new mongoose.Schema({
  playlistName: {
    type: String,
    required: true
  },
  songs: [songSchema],
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Playlist', schema);
