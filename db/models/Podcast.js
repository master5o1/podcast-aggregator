const mongoose = require('mongoose');
const shortid = require('shortid');

const PodcastSchema = new mongoose.Schema({
  id: {
    type: String,
    default: shortid.generate
  },
  url: String
});

mongoose.model('Podcast', PodcastSchema);

module.exports = mongoose.model('Podcast');
