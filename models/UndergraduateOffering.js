const mongoose = require('mongoose');

const UndergraduateDegreeSchema = mongoose.Schema({
  degreeName: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  tutitionFee: {
    type: String,
    required: true,
    trim: true,
  },
  upcomingIntake: {
    type: String,
    required: true,
    trim: true,
  },
  requiredExam: {
    type: String,
    required: true,
  },
  knowMore: {
    // College's URL
    type: String,
  },
});

module.exports = UndergraduateDegreeSchema;
