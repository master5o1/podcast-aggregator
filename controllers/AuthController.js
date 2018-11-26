const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');

const User = require('../db/models/User');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/me', passport.authenticate('basic', { session: false }), (req, res) => {
  const { id, username, role, createdDate } = req.user;
  res.json({ id, username, role, createdDate });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.create({ username, password });

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    createdDate: user.createdDate
  });
});

module.exports = router;
