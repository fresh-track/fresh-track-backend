require('dotenv').config();

const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

const express = require('express');
const app = express();
const open = require('open');

//////////
// MODULE FUNCTIONS
//////////

// GET AUTHORIZATION
function getAuth() {
  return new Promise((resolve) => {
    const oAuth = new OAuth2Client(
      process.env.GDRIVECLIENT_ID,
      process.env.GDRIVECLIENT_SECRET,
      process.env.GDRIVEREDIRECT_URL
    );
 
    const authorizeUrl = oAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
    });
     
    app.get('/oauth2callback', (req, res) => {
      const code = req.query.code;
      oAuth.getToken(code, (err, tokens) => {
        if(err) {
          console.error('Error getting oAuth tokens:');
          throw err;
        }
        oAuth.credentials = tokens;
        res.send('Google Drive authentication successful!');
        server.close();
        resolve(oAuth);
      });
    });
    const server = app.listen(3000, () => {
      open(authorizeUrl, { wait: false });
    });
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
  getAudio
};
