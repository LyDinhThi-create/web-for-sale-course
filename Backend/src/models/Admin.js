
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slug = require('mongoose-slug-updater');

const Schema = mongoose.Schema; 
const Admin = new Schema({
    loginname: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String},
    statusLogin: {type: Boolean, default: false},
},{ timestamps: true }
);

Admin.pre('save', async function(next) {
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
module.exports = mongoose.model('Admin', Admin);

