const { getAuth, getAudio } = require('./lib/services/google-api');

async function getGdrive(folderName) {
  const auth = await getAuth();
  const files = await getAudio(auth, folderName);
  console.log(`Content in ${folderName}`, files);
}

getGdrive('GD Stems');
