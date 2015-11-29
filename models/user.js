var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false, required: true }
})

module.exports = mongoose.model('User', User);
