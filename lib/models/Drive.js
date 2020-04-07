const mongoose = require('mongoose');
const { getAuth, getAudio } = require('../services/google-api');

const audioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  }
});

const schema = new mongoose.Schema({
  driveFolder: {
    type: String,
    required: true
  },
  audioFiles: [audioSchema],
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

schema.pre('save', function(next) {
  console.log(this.driveFolder);

  getGdrive(this.driveFolder)
    .then(songs => this.audioFiles = songs)
    .then(() => next());
});

schema.pre('findOneAndUpdate', async function() {
  const docToUpdate = await this.model.findOne(this.getQuery());
  const newSongs = await getGdrive(docToUpdate.driveFolder);
  this.set({ audioFiles: newSongs });
});

async function getGdrive(folderName) {
  const auth = await getAuth();
  const files = await getAudio(auth, folderName);
  return files;
}

module.exports = mongoose.model('Drive', schema);
