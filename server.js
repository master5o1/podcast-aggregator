const express = require('express');
const mongoose = require('mongoose');

const settings = require('./settings.json');

const feedController = require('./feed/FeedController');
const prototype = require('./prototype');

const app = express();

prototype(app);

mongoose.connect(settings.mongo.connectionString);

app.use('/feed', feedController);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});