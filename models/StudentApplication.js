const mongoose = require('mongoose');

const StudentApplicationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Personal Details
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    minlength: [2, 'First Name cannot be lower than 2 characters'],
  },

  middleName: {
    type: String,
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
    minlength: [2, 'Last Name cannot be lower than 2 characters'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Email address is required'],
    unique: false,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  contactNumber: {
    type: String,
    trim: true,
    required: [true, 'Contact number is required'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    required: [true, 'Please choose a gender'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add a date of birth'],
  },
  citizenShipNumber: {
    type: String,
    required: [true, 'Please add your citizenship number'],
  },
  passportNumber: {
    type: String,
    required: [true, 'Please add your citizenship number'],
  },
  // Personal Details | Correspondence
  temporaryCorrespondenceCountry: {
    type: String,
  },
  temporaryCorrespondenceTown: {
    type: String,
  },
  temporaryCorrespondenceAreaOrStreet: {
    type: String,
  },
  temporaryCorrespondencePostalCode: {
    type: String,
  },
  sameAsTemporaryCorrespondenceAddress: {
    type: Boolean,
    default: false,
  },

  // Personal Details | Permanenet Correspondence
  permanentCorrespondenceCountry: {
    type: String,
  },
  permanentCorrespondenceTown: {
    type: String,
  },
  permanentCorrespondenceAreaOrStreet: {
    type: String,
  },
  permanentCorrespondencePostalCode: {
    type: String,
  },

  // Academic Details
  nameOfInstitution: {
    type: String,
    required: [true, 'Please add the name of the institution'],
  },
  courseOfStudy: {
    type: String,
    required: [true, 'Please add the course of study'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
  },
  endDate: {
    type: Date,
  },
  gradeInPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  gradeIngrade: {
    type: Number,
    min: 0,
    max: 4,
  },

  // English Language Requirements
  englishQualification: {
    type: String,
    enum: ['ielts', 'pte '],
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  attemptedDate: {
    type: Date,
    required: true,
  },

  // Interested course and university
  interestedCountry: {
    type: String,
    required: true,
  },
  interestedUniversity: {
    type: String,
    required: true,
  },
  interestedCourse: {
    type: String,
  },
  educationLevel: {
    type: String,
  },
  monthYearOfEntry: {
    type: String,
  },

  // Personal Statement
  personalStatement: {
    type: String,
  },

  // How did you hear about us?
  hearAboutUs: {
    type: String,
    required: true,
    enum: ['agent', 'search engine', 'social media', 'other'],
  },

  // Files
  passport: String,
  lastAcademicCert: String,
  finalDegreeMarkSheet: String,
  allOtherAcademicDoc: String,
  citizenship: String,
  letterOfRecommendation: String,
  experienceLetter: String,
  englishResult: String,
  cv: String,
  sop: String,
});

module.exports = mongoose.model('StudentApplication', StudentApplicationSchema);
