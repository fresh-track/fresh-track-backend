const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  driveFolder: {
    type: String,
    required: true
  },
  audioFiles: {
    type: String
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  }
});

// Google Drive
// -id
// -Google Drive folder(s)
// -Audio File(s)
// -Reference ID to User
