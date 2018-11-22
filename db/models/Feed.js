const mongoose = require('mongoose');
const shortid = require('shortid');

const Podcast = require('./Podcast');

const FeedSchema = new mongoose.Schema({
  id: {
    type: String,
    default: shortid.generate
  },
  authKey: String,
  title: String,
  podcasts: [{ type: mongoose.Schema.Types.ObjectId, ref: Podcast.modelName }]
});

mongoose.model('Feed', FeedSchema);

module.exports = mongoose.model('Feed');
