const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Please provide your email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  contactNumber: {
    type: String,
    trim: true,
    required: [true, 'Please provide your contact number'],
  },
  anyQuestions: {
    type: String,
    trim: true,
  },
  countryQuery: {
    type: String,
  },
  subjectQuery: {
    type: String,
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
