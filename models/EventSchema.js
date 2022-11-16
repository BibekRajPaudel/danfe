const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: String,
  time: Date,
  date: Date,
  details: String,
  image: String,
});

module.exports = mongoose.model('Event', EventSchema);
