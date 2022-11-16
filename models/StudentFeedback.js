const mongoose = require('mongoose');

const StudentFeedbackSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  feedback: {
    type: String,
    trim: true,
  },
  showInHomePage: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('StudentFeedback', StudentFeedbackSchema);
