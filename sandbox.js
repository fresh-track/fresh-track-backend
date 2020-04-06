const bandcamp = require('bandcamp-scraper');
let newAlbumArr = [];
const artistUrl = 'https://nophone.bandcamp.com/';

const getAlbumUrls = (artistUrl) => {
  return new Promise((resolve, reject) => {
    bandcamp.getAlbumUrls(artistUrl, (error, albumUrls) => {
      if(error) return reject(error);
      resolve(albumUrls);
    });
  });
};

const getAlbumInfo = (albumUrl) => {
  return new Promise((resolve, reject) => {
    bandcamp.getAlbumInfo(albumUrl, (error, albumInfo) => {
      if(error) return reject(error);
      resolve(albumInfo);
    });
  });
};

getAlbumUrls(artistUrl)
  .then(albumUrls => {
    return Promise.all(albumUrls.map(getAlbumInfo));
  })
  .then(albumInfos => console.log(albumInfos.map(albumInfo => albumInfo.raw.current.id)));

