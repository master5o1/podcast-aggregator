const mongoose = require('mongoose');
const commandLineArgs = require('command-line-args');

const Podcast = require('./db/models/Podcast');
const fetchPodcast = require('./feed/fetch-podcast');

const optionDefinitions = [
  { name: 'id', alias: 'i', type: String },
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'mongo', alias: 'm', type: String }
];
const options = commandLineArgs(optionDefinitions);

mongoose.connect(options.mongo || 'mongodb://localhost:27017/podcasts');

const fetchOne = async id => {
  const podcast = await Podcast.findOne({ id })
    .populate('data.episodes')
    .exec();

  console.log(`fetching podcast ${podcast.id}: ${podcast.url}`);
  const done = await fetchPodcast(podcast);
  console.log(done);
};

const init = async options => {
  if (options.id) {
    await fetchOne(options.id);
    return;
  }
  console.log('fetching list of podcasts');
  const podcasts = await Podcast.find()
    .populate('data.episodes')
    .exec();

  for (let podcast of podcasts) {
    await fetchOne(podcast.id);
  }
  console.log('finished.');
};

init(options)
  .then(p => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(0);
  });
