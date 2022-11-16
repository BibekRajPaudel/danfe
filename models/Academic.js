const mongoose = require('mongoose');

const AcademicSchema = mongoose.Schema({
  schoolName: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
});

module.exports = AcademicSchema;
