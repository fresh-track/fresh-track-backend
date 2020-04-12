const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

//////////
// MODULE FUNCTIONS
//////////

// move function here to simplify routes
const getAuthUrl = action => {
  return constructOauth().generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
    state: `${action}=${req.query.driveFolder}&${req.user._id}`
  });
}

// create a getToken function to help clean up route
// make it a promise to simplify route code
const getAuth = code => {
  const oAuth = constructOauth();
  return new Promise((resolve, reject) => {
    oAuth.getToken(code, (err, tokens) => {
      if(err) return reject(err);
      oAuth.credentials = tokens
      resolve(oAuth);
    });
  })
}

// GET AUDIO
async function getAudio(auth, folderName) {
  return getFolder(auth, folderName)
    .then(folder => getFiles(auth, folder));
}

//////////
// INTERNAL FUNCTIONS
//////////

function constructOauth() {
  return new OAuth2Client(
    process.env.GDRIVECLIENT_ID,
    process.env.GDRIVECLIENT_SECRET,
    process.env.GDRIVEREDIRECT_URL
  );
}

// create a reusable function to promisify the google drive sdk
function getFilesList(auth, q, fields = 'nextPageToken, files(id, name, mimeType, parents)') {
  const drive = google.drive({ version: 'v3', auth });
  return new Promise((resolve, reject) => {
    drive.files.list({
      pageSize: 1000,
      fields,
      q
    }, (err, res) => {
      if(err) return reject(err)
      return resolve(res.data);
    });
  });
}

// ID OF FOLDER
function getFolder(auth, folderName) {
  return getFilesList(auth, 'mimeType = \'application/vnd.google-apps.folder\'')
    .then(({ files }) => {
      // use find instead of map
      const folder = files.find(file => file.name === folderName);
      if(!folder) throw `No folder found for ${folderName}`;
      return folder.id
    });
}

// FILES IN FOLDER
function getFiles(auth, folderId) {
  return getFilesList(auth, `'${folderId}' in parents`)
    .then(({ files }) => files
      // use filter instead of map
      // use endsWith instead of includes
      .filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.wav'))
      .map(({ name }) => ({ name, url: `https://drive.google.com/u/0/uc?id=${id}&export=download` })))
}

module.exports = {
  getAuth,
  getAuthUrl,
  getAudio
};
