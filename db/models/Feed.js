const mongoose = require('mongoose');
const UIDGenerator = require('uid-generator');
const shortid = require('shortid');

const Podcast = require('./Podcast');

const authkey = {
  generate: () => {
    const uidgen = new UIDGenerator();
    return uidgen.generateSync();
  }
};

const FeedSchema = new mongoose.Schema({
  id: {
    type: String,
    default: shortid.generate
  },
  authKey: {
    type: String,
    default: authkey.generate
  },
  title: String,
  podcasts: [{ type: mongoose.Schema.Types.ObjectId, ref: Podcast.modelName }]
});

mongoose.model('Feed', FeedSchema);

module.exports = mongoose.model('Feed');
