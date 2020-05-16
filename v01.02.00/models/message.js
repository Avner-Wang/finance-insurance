var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  type: String,
  sender: String,
  sendTime: { type: Date, index: true, default: Date.now },
  content: String
});

module.exports = mongoose.model('Message', messageSchema);