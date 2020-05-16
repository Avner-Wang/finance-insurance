var mongoose = require('mongoose');

var dirtywordSchema = new mongoose.Schema({
  type: String,
  words: String,
  character: { type: String, index: true },
  language: String,
  order: Number
});

module.exports = mongoose.model('Dirtyword', dirtywordSchema);