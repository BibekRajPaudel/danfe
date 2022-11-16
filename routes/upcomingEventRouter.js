const express = require('express');
const router = express.Router();
const UserPhoto = require('../models/userprofile/UserPhoto');
const multer = require('multer');
const catchAsync = require('../utils/asyncHandler');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const UpcomingEvent = require('../models/UpcomingEvent');
const {
  addAnEvent,
  getAllEvent,
  getSingleEvent,
  editEvent,
  deleteEvent,
} = require('../controllers/adminController');

const storage = multer.diskStorage({
  // location where the file gets saved
  destination(req, file, cb) {
    cb(null, 'public/uploads/upcomingeventpics');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  // checking if the file extension is either jpg, jpeg or png.
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Checking mime type as every file has it -> image/gif
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images Only Allowed');
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', admin, upload.single('eventImg'), addAnEvent);

router.get('/', admin, getAllEvent);

router
  .route('/:id', admin)
  .get(getSingleEvent)
  .patch(upload.single('eventImg'), editEvent)
  .delete(deleteEvent);

module.exports = router;
