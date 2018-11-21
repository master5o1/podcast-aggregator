const mongoose = require('mongoose');
const shortid = require('shortid');
  
const FeedSchema = new mongoose.Schema({  
  _id: {
    'type': String,
    'default': shortid.generate
  },
  authKey: String,
  title: String,
  podcasts: [String]
});
mongoose.model('Feed', FeedSchema);

module.exports = mongoose.model('Feed');