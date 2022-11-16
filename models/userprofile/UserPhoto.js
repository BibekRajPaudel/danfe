const mongoose = require('mongoose');

const UserPhotoSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  photo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('UserPhoto', UserPhotoSchema);
