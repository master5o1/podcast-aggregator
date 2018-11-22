const express = require('express');
const mongoose = require('mongoose');

const feedController = require('./controllers/FeedController');
const podcastController = require('./controllers/PodcastController');

const app = express();

mongoose.connect('mongodb://localhost:27017/podcasts');

app.use('/feed', feedController);
app.use('/podcast', podcastController);

app.get('/forms', (req, res, next) => {
  res.contentType('text/html').send(`
    <html>
    <form action="/feed" method="post" style="border: solid 1px #000; margin: 20px; padding: 20px;">
      <div>
        <label for="title">Title:</label>
        <br />
        <input type="text" name="title" />
      </div>
      <div>
        <label for="podcasts">Podcast URLs</label> <span>One per line.</span>
        <br />
        <textarea name="podcasts" style="min-height: 200px; min-width: 500px;"></textarea>
      </div>
      <button type="submit">submit</button>
    </form>
    <form action="/podcast" method="post" style="border: solid 1px #000; margin: 20px; padding: 20px;">
        <div>
          <label for="url">Podcast URL:</label>
          <br />
          <input type="text" name="url" />
        </div>
        <button type="submit">submit</button>
      </form>
    </html>`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
