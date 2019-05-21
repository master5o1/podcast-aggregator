const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const Podcast = require('../db/models/Podcast');
const fetchPodcast = require('../utils/fetch-podcast');
const { mapPodcast, mapPodcastWithData } = require('../utils/mappers');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(passport.authenticate('basic', { session: false }));

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

router.get('/:id.rss', async (req, res, next) => {
  const { id } = req.params;
  try {
    const podcast = await Podcast.findOne({ id })
      .populate({ path: 'data.episodes' })
      .exec();

    if (podcast === null) {
      res.sendStatus(404);
      return;
    }

    const pubDate = podcast.data.episodes.reduce((date, e) => {
      return date < e.published ? e.published : date;
    }, new Date(1970, 01, 01));

    console.log(pubDate);

    const builder = new Podcast({
      ...podcast.data,
      pubDate
    });

    for (let episode of episodes.slice(0, 100)) {
      const image = podcast.data.image || '';
      const imageUrl = image.hasOwnProperty('url') ? image.url : image;
      builder.addItem({
        ...mapEpisode(episode),
        date: episode.published,
        description: `${podcast.data.title}: ${episode.description}`,
        itunesSummary: undefined,
        itunesImage: episode.itunesImage || imageUrl
      });
    }

    const xml = builder.buildXml({ indent: '  ' });

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

    const data = await fetchPodcast(podcast);

    res.contentType('application/json').send(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
