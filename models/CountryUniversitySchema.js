const mongoose = require('mongoose');
const GraduateDegreeSchema = require('./GraduateOffering');
const UndergraduateDegreeSchema = require('./UndergraduateOffering');

const CountryUniversitySchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
  },
  universityName: {
    type: String,
    required: true,
    trim: true,
  },
  universityLocation: {
    type: String,
    required: true,
    trim: true,
  },
  universityInfo: {
    // description
    type: String,
    required: true,
    trim: true,
  },
  universityWebUrl: {
    type: String,
    required: true,
    trim: true,
  },
  brochureDownloadLink: {
    type: String,
    required: true,
    trim: true,
  },
  undergraduateDegreeOffered: [UndergraduateDegreeSchema],
  graduateDegreeOffered: [GraduateDegreeSchema],
});

module.exports = mongoose.model('CountryUniversity', CountryUniversitySchema);
