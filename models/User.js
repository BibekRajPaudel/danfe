const mongoose = require('mongoose');
const bcrypt = require('bcryptjs/dist/bcrypt');
const Academic = require('./Academic');
const ExperienceDetailSchema = require('./ExperienceDetail');
const TestDetailsSchema = require('./Test');
const PreferredCountryAndUniSchema = require('./PreferredCountryAndUni');
const crypto = require("crypto")
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema(
  {
    // Mandatory fields
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true,
      minlength: [2, 'Name cannot be lower than 2 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true,
      minlength: [2, 'Name cannot be lower than 2 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email address is required'],
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
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date,

    // Optional Fields
    dateOfBirth: String,
    temporaryAddress: String,
    permanentAddress: String,

    // Academic Details
    academicDetails: [Academic],

    // Experience Details
    experienceDetails: [ExperienceDetailSchema],

    // Test Score
    testScores: [TestDetailsSchema],

    // Preferred Country and University
    preferredCountryAndUni: [PreferredCountryAndUniSchema],
    isAdmin: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

// Checking if the sent password matches with password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  // Encrypting before saving it in database
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Getting token from database and authenticating the user
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


//Getting Reset Password Token
 // Generating Password Reset Token
 UserSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
 }


module.exports = mongoose.model('User', UserSchema);
