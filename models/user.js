var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
  email: { type: String },
  password: { type: String },
  admin: { type: Boolean, default: false }
})

module.exports = mongoose.model('User', User);
