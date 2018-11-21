const fetch = require('node-fetch');
const parsePodcast = require('node-podcast-parser');
const Podcast = require('podcast');

module.exports = (app) => {
  const log = (type, message) => console.log(`[${type}] ${message}`);

  const parsePodcastAsync = async xml =>
    new Promise((resolve, reject) => {
      parsePodcast(xml, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

  const feeds = [
    'https://www.radionz.co.nz/oggcasts/ninetonoon.rss',
    'https://www.radionz.co.nz/oggcasts/nights.rss',
    'https://www.radionz.co.nz/oggcasts/your-money.rss',
    'https://www.radionz.co.nz/oggcasts/bang.rss',
    'https://www.relay.fm/cortex/feed',
    'http://www.hellointernet.fm/podcast?format=rss',
    'http://feeds.99percentinvisible.org/99percentinvisible',
    'https://www.npr.org/rss/podcast.php?id=510289',
    'https://www.npr.org/rss/podcast.php?id=510325',
    'http://feeds.trumpconlaw.com/TrumpConLaw',
    'http://feeds.feedburner.com/thetruthapm',
    'http://feeds.everythingisalive.com/everythingisalive',
    'http://feeds.gimletmedia.com/eltshow',
    'https://audioboom.com/channels/2399216.rss',
    'http://podcasts.files.bbci.co.uk/p02pc9x6.rss',
    'http://podcasts.files.bbci.co.uk/p02pc9pj.rss'
  ];

  app.get('/prototype', async (req, res, next) => {
    const podcasts = await Promise.all(
      feeds
        .map(async url => {
          log('fetch', url);
          const response = await fetch(url);
          if (!response.ok) {
            return undefined;
          }
          log('fetch OK!', url);
          const xml = await response.text();
          return await parsePodcastAsync(xml);
        })
        .filter(async xml => !!(await xml))
    );

    const aggregate = new Podcast({
      title: 'Feed Aggregator',
      customNamespaces: {
        media: 'http://search.yahoo.com/mrss/'
      }
    });

    const episodes = podcasts.reduce((a, cast) => a.concat(cast.episodes.map(e => ({ ...e, series: cast.title }))), []);

    episodes.sort((a, b) => new Date(b.published) - new Date(a.published));

    for (let episode of episodes.slice(0, 100)) {
      aggregate.addItem({
        ...episode,
        date: episode.published,
        description: `${episode.series}: ${episode.description}`,
        itunesSummary: undefined
      });
    }

    const xml = aggregate.buildXml({ indent: '  ' });

    res.contentType = 'application/xml';
    res.send(xml);
  });
};