const express = require('express');
const bodyParser = require('body-parser');

const Podcast = require('../db/models/Podcast');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const mapPodcast = podcast => ({
  id: podcast.id,
  url: podcast.url
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
    );

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
    const podcast = await Podcast.findOne({ id }).exec();

    if (podcast === null) {
      res.sendStatus(404);
      return;
    }

    res
      .contentType('application/json')
      .status(200)
      .send(mapPodcast(podcast));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
