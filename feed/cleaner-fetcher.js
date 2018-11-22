const fetch = require('node-fetch');
const parsePodcast = require('node-podcast-parser');

const fetchPodcastXml = async url => {
  const response = await fetch(url);
  if (response.ok) {
    throw Error(response.statusText);
  }
  const text = await response.text();
  if (!text) {
    throw Error('Fetched podcast feed text is empty');
  }

  return text;
};

const parsePodcastXml = async xml => {
  new Promise((resolve, reject) => {
    parsePodcast(xml, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
