
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slug = require('mongoose-slug-updater');

const Schema = mongoose.Schema; 
const User = new Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String},
    role: {type: String, default: 'user'},
    slug: { type: String, slug: "fullname", unique: true },
    statusLogin: {type: Boolean, default: false},

},{ timestamps: true }
);

User.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // 10 vòng hash
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

mongoose.plugin(slug);
module.exports = mongoose.model('User', User);

