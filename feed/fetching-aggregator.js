const fetch = require('node-fetch');
const parsePodcast = require('node-podcast-parser');
const Podcast = require('podcast');

const parsePodcastAsync = async xml =>
  new Promise((resolve, reject) => {
    parsePodcast(xml, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

const fetchAndParse = async feeds => {
  return await Promise.all(
    feeds
      .map(async url => {
        console.log(`[FETCHING] ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          return undefined;
        }
        console.log(`[GOT] ${url}`);
        const xml = await response.text();
        return await parsePodcastAsync(xml);
      })
      .filter(async xml => !!(await xml))
  );
};

const mergeEpisodes = podcasts => {
  console.log(`[MERGE EPISODES]`);
  const episodes = podcasts.reduce(
    (a, podcast) => a.concat(podcast.episodes.map(episode => ({ episode, podcast }))),
    []
  );
  episodes.sort((a, b) => new Date(b.episode.published) - new Date(a.episode.published));
  return episodes;
};

module.exports = async feed => {
  const aggregate = new Podcast({ title: feed.title });
  const podcasts = await fetchAndParse(feed.podcasts.map(podcast => podcast.url));
  const episodes = mergeEpisodes(podcasts);

  for (let episode of episodes.slice(0, 100)) {
    console.log(`[ADD] ${episode.podcast.title} - ${episode.episode.title}`);
    const image = episode.podcast.hasOwnProperty('image') ? episode.podcast.image : '';
    const imageUrl = image.hasOwnProperty('url') ? image.url : image;
    aggregate.addItem({
      ...episode.episode,
      date: episode.episode.published,
      description: `${episode.podcast.title}: ${episode.episode.description}`,
      itunesSummary: undefined,
      itunesImage: episode.episode.itunesImage || imageUrl
    });
  }

  console.log('[DONE]');
  return aggregate.buildXml({ indent: '  ' });
};
