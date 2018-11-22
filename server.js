const express = require('express');
const mongoose = require('mongoose');

const feedController = require('./feed/FeedController');

const app = express();

mongoose.connect('mongodb://localhost:27017/podcasts');

app.use('/feed', feedController);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
