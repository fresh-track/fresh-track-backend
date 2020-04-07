require('dotenv').config();

// const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

// const express = require('express');
// const app = express();
// const open = require('open');
const EventEmitter = require('events');
const ee = new EventEmitter();

//////////
// MODULE FUNCTIONS
//////////

// GET AUTHORIZATION
function getAuth(id) {
  return new Promise((resolve) => {
    ee.once(`token-${id}`, resolve);
  });
}

// GET AUDIO
async function getAudio(auth, folderName) {
  const folder = await getFolder(auth, folderName);
  const files = await getFiles(auth, folder);
  return files;
}

//////////
// INTERNAL FUNCTIONS
//////////

// ID OF FOLDER
function getFolder(auth, folderName) {
  const drive = google.drive({ version: 'v3', auth });  
  return new Promise((resolve) => {
    drive.files.list({
      pageSize: 1000,
      fields: 'nextPageToken, files(id, name, mimeType, parents)',
      q: 'mimeType = \'application/vnd.google-apps.folder\''
    }, (err, res) => {
      if(err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if(files.length) {
        files.map((file) => {
          if(file.name === folderName) {
            resolve(file.id);
          }
        });
      } else {
        console.log('No files found.');
      }
    });
  });
}

// FILES IN FOLDER
function getFiles(auth, folderId) {
  const drive = google.drive({ version: 'v3', auth }); 
  let musicList = [];
  return new Promise((resolve) => {
    drive.files.list({
      pageSize: 1000,
      fields: 'nextPageToken, files(id, name, mimeType, parents)',
      q: `'${folderId}' in parents`
    }, (err, res) => {
      if(err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if(files.length) {
        files.map((file) => {
          if(file.name.includes('.mp3') || file.name.includes('.wav')) {
            musicList.push({
              name: file.name,
              googleId: file.id
            });
          }
        });
      } else {
        console.log('No files found.');
      }
      resolve(musicList);
    });
  });
}

module.exports = {
  getAuth,
  getAudio,
  ee
};
