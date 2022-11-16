const mongoose = require('mongoose');

const TestDetailsSchema = mongoose.Schema({
  exam: String,
  score: Number,
  attemptedDate: Date,
});

module.exports = TestDetailsSchema;
