const mongoose = require('mongoose');
const shortid = require('shortid');

const EnclosureSchema = new mongoose.Schema({
  filesize: Number,
  type: String,
  url: String
});

const EpisodeSchema = new mongoose.Schema({
  id: {
    type: String,
    default: shortid.generate
  },
  guid: String,
  title: String,
  description: String,
  explicity: Boolean,
  image: String,
  published: Date,
  duration: Number,
  categories: [String],
  enclosure: EnclosureSchema
});

mongoose.model('Episode', EpisodeSchema);

module.exports = mongoose.model('Episode');
