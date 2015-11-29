var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Message = new Schema({
  content: { type: String },
  sender_id: { type: Object },
  created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', Message);
