const express = require('express');
const bodyParser = require('body-parser');
const UIDGenerator = require('uid-generator');

const Feed = require('./Feed');
const aggregator = require('./fetching-aggregator');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    res.contentType = 'text/html';
    res.send(`
    <html>
    <form action="/feed" method="post">
      <label for="title">Title:</label>
      <br />
      <input type="text" name="title" />
      <br />
      <label for="podcasts">Podcast URLs</label> <span>One per line.</span>
      <br />
      <textarea name="podcasts"></textarea>
      <br />
      <button type="submit">submit</button>
    </form>
    </html>`);
});

router.post('/', async (req, res, next) => {
    const { title, podcasts } = req.body;
    try {
        const uidgen = new UIDGenerator();
        const feed = await Feed.create({
            authKey: await uidgen.generate(),
            title: title,
            podcasts: podcasts.replace(/\r?\n/g, '\n').split('\n')
        });

        const url = 'http://localhost:3000';
        res.send(`
<html><pre>
FEED URL:
${url}/feed/${feed._id}

To delete, send a DELETE request:
DELETE ${url}/feed/${feed._id}/${feed.authKey}
</pre></html>
        `);
    } catch (e) {
        next(e);
    }
});

router.get('/:id/', async (req, res, next) => {
    const { id } = req.params;
    try {
        const feed = await Feed.findOne({ _id: id }).exec();
        const xml = await aggregator(feed.title, feed.podcasts);
        
        res.set('Content-Type', 'application/xml');
        res.send(xml);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id/:authKey', async (req, res, next) => {
    const { id, authKey } = req.params;
    try {
        const feed = await Feed.deleteOne({ _id: id, authKey: authKey }).exec();
        res.contentType('application/json');
        res.send(feed);
    } catch (e) {
        next(e);
    }
});

module.exports = router;