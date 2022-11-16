const mongoose = require('mongoose');

const CounsellingTime = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Email address is required'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  education: {
    type: String,
    required: true,
    trim: true,
  },
  englishtestname: {
    type: String,
    required: true,
    enum: ['IETLS', 'TOEFL', 'PTE'],
  },
  englishscore: {
    type: Date,
    required: true,
    trim: true,
  },
  countryChoice: {
    type: String,
    required: true,
    trim: true,
  },
  universityChoice: {
    type: String,
    required: true,
    trim: true,
  },
  preferredIntake: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Counselling', CounsellingTime);
