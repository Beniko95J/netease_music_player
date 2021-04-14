const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {type: String},
  duration: {type: mongoose.SchemaTypes.Number},
  artists: {type: String},
  album: {type: String},
  songId: {type: mongoose.SchemaTypes.Number},
})

module.exports = mongoose.model('Song', schema);
