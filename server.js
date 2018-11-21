const express = require('express');
const mongoose = require('mongoose');

const settings = require('./settings.json');

const feedController = require('./feed/FeedController');
const prototype = require('./prototype');

const app = express();

prototype(app);

mongoose.connect(settings.mongo.connectionString);

app.use('/feed', feedController);

app.get('/', (req, res, next) => {
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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});