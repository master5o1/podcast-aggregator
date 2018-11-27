const fetch = require('node-fetch');

module.exports = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const text = await response.text();
  if (!text) {
    throw Error('Fetched podcast feed text is empty');
  }

  return text;
};
