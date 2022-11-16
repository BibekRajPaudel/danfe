const mongoose = require('mongoose');

const PreferredCountryAndUniSchema = mongoose.Schema({
  country: String,
  university: String,
  course: String,
  intake: Date,
  budget: String,
  scholarship: Boolean,
});

module.exports = PreferredCountryAndUniSchema;
