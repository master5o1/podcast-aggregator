const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');

const User = require('../db/models/User');
const { mapUser } = require('../utils/mappers');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(passport.authenticate('basic', { session: false }));

router.get('/me', (req, res) => {
  const { id, username, role, createdDate } = req.user;
  res.json({ id, username, role, createdDate });
});

router.post('/register', async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    res.sendStatus(401);
  }
  const { username, password } = req.body;

  const user = await User.create({ username, password });

  res.json(mapUser(user));
});

module.exports = router;
