const mongoose = require('mongoose');
const UIDGenerator = require('uid-generator');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const authkey = {
  generate: () => {
    const uidgen = new UIDGenerator();
    return uidgen.generateSync();
  }
};

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    default: authkey.generate
  },
  createdDate: {
    type: Date,
    default: () => new Date()
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  }
});

UserSchema.pre('save', async function(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR);
  next();
});

UserSchema.methods.verifyPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
