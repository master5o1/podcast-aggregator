const mongoose = require('mongoose');
const commandLineArgs = require('command-line-args');

const { fetchPodcastXml, parsePodcastXml } = require('./feed/utils');

const Podcast = require('./db/models/Podcast');
const Episode = require('./db/models/Episode');

const optionDefinitions = [
  { name: 'id', alias: 'i', type: String },
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'mongo', alias: 'm', type: String }
];
const options = commandLineArgs(optionDefinitions);

mongoose.connect(options.mongo || 'mongodb://localhost:27017/podcasts');

const fetchPodcast = async podcast => {
  if (!podcast) {
    res.sendStatus(404);
    return;
  }

  const xml = await fetchPodcastXml(podcast.url);
  const json = await parsePodcastXml(xml);

  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  const episodes = await Promise.all(
    json.episodes.map(async episode => {
      return await Episode.findOneAndUpdate({ 'enclosure.url': episode.enclosure.url }, episode, options);
    })
  );

  podcast.data = {
    ...podcast.data,
    ...json,
    episodes: [...podcast.data.episodes, ...episodes]
  };

  podcast.save();

  return {
    id: podcast.id,
    fetched: episodes.length,
    total: podcast.data.episodes.length
  };
};

const init = async options => {
  if (options.id) {
    const podcast = await Podcast.findOne({ id: options.id })
      .populate('data.episodes')
      .exec();

    console.log(`fetching podcast ${podcast.id}: ${podcast.url}`);
    const done = await fetchPodcast(podcast);
    console.log(done);
    return;
  }
  console.log('fetching list of podcasts');
  const podcasts = await Podcast.find()
    .populate('data.episodes')
    .exec();

  for (let podcast of podcasts) {
    console.log(`fetching podcast ${podcast.id}: ${podcast.url}`);
    const done = await fetchPodcast(podcast);
    console.log(done);
  }
  console.log('finished.');
};

init(options)
  .then(p => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(0);
  });
