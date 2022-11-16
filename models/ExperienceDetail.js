const mongoose = require('mongoose');

const ExperienceDetailSchema = mongoose.Schema({
  jobTitle: String,
  employmentType: String,
  companyName: String,
  companyAddress: String,
  companyJoinDate: String,
  companyLeaveDate: String,
});

module.exports = ExperienceDetailSchema;
