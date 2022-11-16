const mongoose = require('mongoose');

const DocumentGallerySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

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

module.exports = mongoose.model('DocumentGallery', DocumentGallerySchema);
