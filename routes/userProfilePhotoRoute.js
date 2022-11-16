const express = require('express');
const router = express.Router();
const UserPhoto = require('../models/userprofile/UserPhoto');
const multer = require('multer');
const catchAsync = require('../utils/asyncHandler');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  // location where the file gets saved
  destination(req, file, cb) {
    cb(null, 'public/uploads');
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

router.post(
  '/',
  upload.single('image'),
  catchAsync(async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const userExist = await UserPhoto.exists({
      userId: req.user._id,
    });

    console.log(userExist);

    if (userExist && userExist._id) {
      await UserPhoto.deleteOne({ userId: req.user._id });

      const pic = await UserPhoto.create({
        userId: req.user._id,
        photo: file.path,
      });

      res.status(200).json({
        msg: 'Profile picture updated',
        pic,
      });
    } else {
      const newpic = await UserPhoto.create({
        userId: req.user._id,
        photo: file.path,
      });

      res.status(200).json({
        msg: 'Profile picture added',
        newpic,
      });
    }
  })
);

router.get(
  '/',
  protect,
  catchAsync(async (req, res) => {
    // console.log(req.)
    const user = await UserPhoto.findOne({ userId: req.user._id });

    if (user) {
      res.status(200).json({
        user,
      });
    } else {
      res.status(400).json({
        msg: 'Something went wrong',
      });
    }
  })
);

module.exports = router;
