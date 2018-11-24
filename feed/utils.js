const fetch = require('node-fetch');
const parsePodcast = require('node-podcast-parser');
const Podcast = require('podcast');

const fetchPodcastXml = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const text = await response.text();
  if (!text) {
    throw Error('Fetched podcast feed text is empty');
  }

  return text;
};

const parsePodcastXml = async xml => {
  return new Promise((resolve, reject) => {
    parsePodcast(xml, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const mergeEpisodes = podcasts => {
  const episodes = podcasts.reduce(
    (a, podcast) => a.concat(podcast.data.episodes.map(episode => ({ episode, podcast }))),
    []
  );
  episodes.sort((a, b) => new Date(b.episode.published) - new Date(a.episode.published));
  return episodes;
};

const aggregate = feed => {
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

module.exports.fetchPodcastXml = fetchPodcastXml;
module.exports.parsePodcastXml = parsePodcastXml;
module.exports.mergeEpisodes = mergeEpisodes;
module.exports.aggregate = aggregate;
