module.exports = podcasts => {
  const episodes = podcasts.reduce(
    (a, podcast) => a.concat(podcast.data.episodes.map(episode => ({ episode, podcast }))),
    []
  );
  episodes.sort((a, b) => new Date(b.episode.published) - new Date(a.episode.published));
  return episodes;
};
