const mongoose = require('mongoose');
const shortid = require('shortid');

const Episode = require('./Episode');

const PodcastSchema = new mongoose.Schema({
  id: {
    type: String,
    default: shortid.generate
  },
  url: String,
  data: {
    title: String,
    description: {
      short: String,
      long: String
    },
    link: String,
    image: String,
    language: String,
    copyright: String,
    updated: Date,
    explicit: Boolean,
    categories: [String],
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: Episode.modelName }]
  }
});

mongoose.model('Podcast', PodcastSchema);

module.exports = mongoose.model('Podcast');
