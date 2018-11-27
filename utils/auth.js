const { BasicStrategy } = require('passport-http');
const User = require('../db/models/User');

module.exports.basicStrategy = new BasicStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return done(null, null);
    }

    const verified = await user.verifyPassword(password);
    if (verified) {
      return done(null, user);
    }
    done('incorrect credentials');
  } catch (e) {
    done(err);
  }
});
