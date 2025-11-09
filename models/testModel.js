const mongoose = require('mongoose');

const sportSchema = mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    minLength: 10,
  },
  age: {
    type: Number,
  },
});

const Sport = mongoose.model('Sport', sportSchema);

module.exports = Sport;
