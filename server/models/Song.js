const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  song: {type: String},
  dt: {type: String},
  singer: {type: String},
  album: {type: String},
  id: {type: mongoose.SchemaTypes.Number},
})

module.exports = mongoose.model('Song', schema);
