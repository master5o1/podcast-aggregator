const uniqBy = require('lodash.uniqby');

const { fetchPodcastXml, parsePodcastXml } = require('./utils');
const Episode = require('../db/models/Episode');

module.exports = async podcast => {
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
    episodes: uniqBy([...podcast.data.episodes, ...episodes], e => e.enclosure.url)
  };

  podcast.save();

  return {
    id: podcast.id,
    fetched: episodes.length,
    total: podcast.data.episodes.length
  };
};
