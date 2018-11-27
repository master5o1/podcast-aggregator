const parsePodcast = require('node-podcast-parser');

module.exports = async xml => {
  return new Promise((resolve, reject) => {
    parsePodcast(xml, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
