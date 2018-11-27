const Podcast = require('podcast');
const mergeEpisodes = require('./merge-episodes');

module.exports = feed => {
  const builder = new Podcast({ title: feed.title });
  const episodes = mergeEpisodes(feed.podcasts);

  for (let episode of episodes.slice(0, 100)) {
    const image = episode.podcast.data.image || '';
    const imageUrl = image.hasOwnProperty('url') ? image.url : image;
    builder.addItem({
      ...episode.episode,
      date: episode.episode.published,
      description: `${episode.podcast.data.title}: ${episode.episode.description}`,
      itunesSummary: undefined,
      itunesImage: episode.episode.itunesImage || imageUrl
    });
  }

  const xml = builder.buildXml({ indent: '  ' });
  return xml;
};
