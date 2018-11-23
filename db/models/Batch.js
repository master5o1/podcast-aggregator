const mongoose = require('mongoose');
const shortid = require('shortid');

/// hmmm; Batch is a bit of a dumb name.
const BatchSchema = new mongoose.Schema({
  id: {
    type: String,
    default: shortid.generate
  },
  url: String,
  runTime: Date,
  xml: String
});

mongoose.model('Batch', BatchSchema);

module.exports = mongoose.model('Batch');
