const express = require('express');
const bodyParser = require('body-parser');

const Feed = require('../db/models/Feed');
const Podcast = require('../db/models/Podcast');

const { aggregate } = require('../feed/utils');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mapFeed = (feed, authKey = false) => ({
  id: feed.id,
  title: feed.title,
  authKey: authKey ? feed.authKey : undefined,
  podcasts: feed.podcasts.map(podcast => ({
    id: podcast.id,
    url: podcast.url
  }))
});

router.get('/', async (req, res, next) => {
  try {
    const feeds = await Feed.find()
      .populate({
        path: 'podcasts',
        populate: {
          path: 'data.episodes'
        }
      })
      .exec();

    res
      .contentType('application/json')
      .status(200)
      .send(feeds.map(feed => mapFeed(feed)));
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let { title, podcasts } = req.body;

    if (typeof podcasts === 'string') {
      podcasts = podcasts
        .replace(/\r?\n/g, '\n')
        .split('\n')
        .map(url => ({ url }));
    }

    const savedPodcasts = await Promise.all(
      podcasts.map(async podcast => {
        return await Podcast.findOneAndUpdate(
          { url: podcast.url },
          { url: podcast.url },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      })
    );

    const feed = await Feed.create({
      title: title,
      podcasts: savedPodcasts
    });

    res
      .contentType('application/json')
      .status(201)
      .send(mapFeed(feed, true));
  } catch (e) {
    next(e);
  }
});

router.get('/:id.rss', async (req, res, next) => {
  const { id } = req.params;
  try {
    const feed = await Feed.findOne({ id })
      .populate({
        path: 'podcasts',
        populate: {
          path: 'data.episodes'
        }
      })
      .exec();

    if (feed === null) {
      res.sendStatus(404);
      return;
    }

    const xml = aggregate(feed);

    res
      .contentType('application/xml')
      .status(200)
      .send(xml);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const feed = await Feed.findOne({ id })
      .populate({
        path: 'podcasts',
        populate: {
          path: 'data.episodes'
        }
      })
      .exec();

    if (feed === null) {
      res.sendStatus(404);
      return;
    }

    res
      .contentType('application/json')
      .status(200)
      .send(mapFeed(feed));
  } catch (e) {
    next(e);
  }
});

router.delete('/:id/:authKey', async (req, res, next) => {
  const { id, authKey } = req.params;
  try {
    const feed = await Feed.deleteOne({ id, authKey }).exec();

    res
      .contentType('application/json')
      .status(200)
      .send(feed);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
