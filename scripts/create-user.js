const mongoose = require('mongoose');
const commandLineArgs = require('command-line-args');

const User = require('../db/models/User');

const optionDefinitions = [
  { name: 'username', alias: 'u', type: String },
  { name: 'password', alias: 'p', type: String },
  { name: 'isAdmin', alias: 'a', type: Boolean },
  { name: 'mongo', alias: 'm', type: String }
];
const options = commandLineArgs(optionDefinitions);

mongoose.connect(options.mongo || 'mongodb://localhost:27017/podcasts');

const init = async options => {
  const { username, password, isAdmin } = options;
  const user = await User.create({
    username,
    password,
    role: isAdmin ? 'admin' : 'user'
  });

  console.log('user created.');
  console.log(mapUser(user));
};

init(options)
  .then(p => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(0);
  });
