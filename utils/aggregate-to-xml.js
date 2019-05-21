const Podcast = require('podcast');
const mergeEpisodes = require('./merge-episodes');
const { mapEpisode } = require('./mappers');

module.exports = feed => {
  const episodes = mergeEpisodes(feed.podcasts);

  const builder = new Podcast({
    title: feed.title,
    pubDate: episodes.reduce((date, e) => {
      return date < e.episode.published ? e.episode.published : date;
    }, new Date(1970, 01, 01))
  });

  for (let episode of episodes.slice(0, 100)) {
    const image = episode.podcast.data.image || '';
    const imageUrl = image.hasOwnProperty('url') ? image.url : image;
    builder.addItem({
      ...mapEpisode(episode.episode),
      date: episode.episode.published,
      description: `${episode.podcast.data.title}: ${episode.episode.description}`,
      itunesSummary: undefined,
      itunesImage: episode.episode.itunesImage || imageUrl,
      url: episode.episode.link
    });
  }

  const xml = builder.buildXml({ indent: '  ' });
  return xml;
};
