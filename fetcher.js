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

const fetchPodcast = async id => {
  try {
    const podcast = await Podcast.findOne({ id })
      .populate('data.episodes')
      .exec();

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
  } catch (e) {
    console.error(e);
  }
};

const init = async options => {
  if (options.id) {
    console.log(`fetching one podcast ${options.id}`);
    const done = await fetchPodcast(options.id);
    console.log(done);

    return;
  }
  console.log('not done anything');
};

init(options).then(p => process.exit(0));
