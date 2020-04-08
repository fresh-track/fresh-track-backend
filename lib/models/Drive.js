const mongoose = require('mongoose');
const { getAudio } = require('../services/google-api');

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
  const exist = await this.find({ driveFolder: driveFolder, userRef: userRef });
  if(exist.length > 0) throw Error('User already uploaded this folder');
  const audioFiles = await getAudio(auth, driveFolder);
  return this.create({ driveFolder, userRef, audioFiles });
};

schema.statics.updateAudioFiles = async function(driveFolder, userRef, auth) {
  const folderToUpdate = await this.find({ _id: driveFolder, userRef: userRef });
  const audioFiles = await getAudio(auth, folderToUpdate[0].driveFolder);
  return this.findOneAndUpdate({
    _id: driveFolder,
    userRef: userRef
  }, { $set: { audioFiles: audioFiles } }, { new: true });
};

module.exports = mongoose.model('Drive', schema);
