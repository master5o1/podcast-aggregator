const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');

const feedController = require('./controllers/FeedController');
const podcastController = require('./controllers/PodcastController');
const authController = require('./controllers/AuthController');

const User = require('./db/models/User');

const app = express();

mongoose.connect('mongodb://localhost:27017/podcasts');

passport.use(
  new BasicStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).exec();

      if (!user) {
        return done(null, null);
      }

      if (await user.verifyPassword(password)) {
        return done(null, user);
      }
    } catch (e) {
      done(err);
    }
  })
);

app.use('/feed', feedController);
app.use('/podcast', podcastController);
app.use('/auth', authController);

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
    <form action="/auth/register" method="post" style="border: solid 1px #000; margin: 20px; padding: 20px;">
      <div>
        <label for="url">Username:</label>
        <br />
        <input type="text" name="username" />
      </div>
      <div>
        <label for="url">Password:</label>
        <br />
        <input type="password" name="password" />
      </div>
      <button type="submit">submit</button>
    </form>
    </html>`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
