var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

var User = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, index: true, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false, required: true }
});

User.plugin(uniqueValidator);

module.exports = mongoose.model('User', User);
