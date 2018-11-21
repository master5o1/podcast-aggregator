const fetch = require('node-fetch');
const parsePodcast = require('node-podcast-parser');
const Podcast = require('podcast');

const parsePodcastAsync = async xml => new Promise((resolve, reject) => {
    parsePodcast(xml, (err, data) => {
    if (err) {
        reject(err);
    }
    resolve(data);
    });
});

const fetchAndParse = async (feeds) => {
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

const mergeEpisodes = (podcasts) => {
    console.log(`[MERGE EPISODES]`);
    const episodes = podcasts.reduce((a, cast) => a.concat(cast.episodes.map(e => ({ ...e, series: cast.title }))), []);
    episodes.sort((a, b) => new Date(b.published) - new Date(a.published));
    return episodes;
};

module.exports = async (title, feeds) => {
    const aggregate = new Podcast({ title });
    const podcasts = await fetchAndParse(feeds);
    const episodes = mergeEpisodes(podcasts);

    for (let episode of episodes.slice(0, 100)) {
      console.log(`[ADD] ${episode.series} - ${episode.title}`);
      aggregate.addItem({
        ...episode,
        date: episode.published,
        description: `${episode.series}: ${episode.description}`,
        itunesSummary: undefined
      });
    }

    console.log('[DONE]');
    return aggregate.buildXml({ indent: '  ' });
};