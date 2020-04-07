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
    // required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

schema.statics.createWithAudioFiles = async function(driveFolder, userRef, auth) {
  const audioFiles = await getAudio(auth, driveFolder);
  return this.create({ driveFolder, userRef, audioFiles });
};

// schema.pre('findOneAndUpdate', async function() {
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   const newSongs = await getGdrive(docToUpdate.driveFolder);
//   this.set({ audioFiles: newSongs });
// });

// async function getGdrive(id, folderName) {
//   const auth = await getAuth(id);
//   const files = await getAudio(auth, folderName);
//   return files;
// }

module.exports = mongoose.model('Drive', schema);
