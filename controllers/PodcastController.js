const express = require('express');
const bodyParser = require('body-parser');

const { fetchPodcastXml, parsePodcastXml } = require('../feed/utils');

const Podcast = require('../db/models/Podcast');
const Episode = require('../db/models/Episode');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

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

router.get('/', async (req, res, next) => {
  try {
    const podcasts = await Podcast.find().exec();

    res
      .contentType('application/json')
      .status(200)
      .send(podcasts.map(mapPodcast));
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  const { url } = req.body;
  try {
    const podcast = await Podcast.findOneAndUpdate(
      { url },
      { url },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    res
      .contentType('application/json')
      .status(201)
      .send(mapPodcast(podcast));
  } catch (e) {
    next(e);
  }
});

router.get('/:id/', async (req, res, next) => {
  const { id } = req.params;
  try {
    const podcast = await Podcast.findOne({ id })
      .populate('data.episodes')
      .exec();

    if (podcast === null) {
      res.sendStatus(404);
      return;
    }

    res
      .contentType('application/json')
      .status(200)
      .send(mapPodcastWithData(podcast));
  } catch (e) {
    next(e);
  }
});

router.get('/:id/fetch', async (req, res, next) => {
  const { id } = req.params;

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

    res.contentType('application/json').send({
      id: podcast.id,
      fetched: episodes.length,
      total: podcast.data.episodes.length
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
