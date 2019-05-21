const mapFeed = (feed, authKey = false) => ({
  id: feed.id,
  title: feed.title,
  authKey: authKey ? feed.authKey : undefined,
  podcasts: feed.podcasts.map(mapPodcast)
});

const mapFeedWithData = feed => ({
  id: feed.id,
  title: feed.title,
  podcasts: feed.podcasts.map(mapPodcastWithData)
});

const mapPodcast = podcast => ({
  id: podcast.id,
  url: podcast.url
});

const mapEpisode = episode => ({
  id: episode.id,
  guid: episode.guid,
  title: episode.title,
  description: episode.description,
  explicit: episode.explicit,
  image: episode.image,
  published: episode.published,
  duration: episode.duration,
  categories: episode.categories,
  link: episode.link,
  enclosure: {
    filesize: episode.enclosure.filesize,
    type: episode.enclosure.type,
    url: episode.enclosure.url
  }
});

const mapPodcastWithData = podcast => ({
  ...mapPodcast(podcast),
  data: {
    ...podcast.data,
    episodes: podcast.data.episodes.map(mapEpisode)
  }
});

const mapUser = user => ({
  id: user.id,
  username: user.username,
  role: user.role,
  createdDate: user.createdDate
});

module.exports.mapFeed = mapFeed;
module.exports.mapFeedWithData = mapFeedWithData;
module.exports.mapPodcast = mapPodcast;
module.exports.mapEpisode = mapEpisode;
module.exports.mapPodcastWithData = mapPodcastWithData;
module.exports.mapUser = mapUser;
