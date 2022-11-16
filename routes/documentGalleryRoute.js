const express = require('express');
const multer = require('multer');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const UserDocumentGallery = require('../models/userprofile/UserDocumentGallery');
const { protect } = require('../middleware/authMiddleware');
const { fileFilterPdfAndDocCheck } = require('../utils/multerStorage');

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/userprofiledocs');
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname.split('.')[0];

    cb(
      null,
      originalName + '-' + req.user._id + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
  fileFilter: fileFilterPdfAndDocCheck,
  limits: {
    fileSize: 1200 * 1200,
  },
});

var uploadMultiple = upload.fields([
  {
    name: 'passport',
    maxCount: 1,
  },
  { name: 'lastAcademicCert', maxCount: 1 },
  { name: 'finalDegreeMarkSheet', maxCount: 1 },
  { name: 'allOtherAcademicDoc', maxCount: 1 },
  { name: 'citizenship', maxCount: 1 },
  { name: 'letterOfRecommendation', maxCount: 1 },
  { name: 'experienceLetter', maxCount: 1 },
  { name: 'englishResult', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'sop', maxCount: 1 },
]);

router.post('/', uploadMultiple, async (req, res) => {
  const userDoc = await UserDocumentGallery.findOne({ user: req.user._id });
  console.log(userDoc);
  const {
    passport,
    lastAcademicCert,
    finalDegreeMarkSheet,
    allOtherAcademicDoc,
    citizenship,
    letterOfRecommendation,
    experienceLetter,
    englishResult,
    cv,
    sop,
  } = req.files;

  let obj;

  if (userDoc) {
    obj = {
      passport: passport?.[0].path ? passport?.[0].path : userDoc.passport,

      lastAcademicCert: lastAcademicCert?.[0].path
        ? lastAcademicCert?.[0].path
        : userDoc.lastAcademicCert,

      finalDegreeMarkSheet: finalDegreeMarkSheet?.[0].path
        ? finalDegreeMarkSheet?.[0].path
        : userDoc.finalDegreeMarkSheet,

      allOtherAcademicDoc: allOtherAcademicDoc?.[0].path
        ? allOtherAcademicDoc?.[0].path
        : userDoc.allOtherAcademicDoc,

      citizenship: citizenship?.[0].path
        ? citizenship?.[0].path
        : userDoc.citizenship,

      letterOfRecommendation: letterOfRecommendation?.[0].path
        ? letterOfRecommendation?.[0].path
        : userDoc.letterOfRecommendation,

      experienceLetter: experienceLetter?.[0].path
        ? experienceLetter?.[0].path
        : userDoc.experienceLetter,

      englishResult: englishResult?.[0].path
        ? englishResult?.[0].path
        : userDoc.englishResult,

      cv: cv?.[0].path ? cv?.[0].path : userDoc.cv,
      sop: sop?.[0].path ? sop?.[0].path : userDoc.sop,
    };

    userDoc.passport = obj.passport;
    userDoc.lastAcademicCert = obj.lastAcademicCert;
    userDoc.finalDegreeMarkSheet = obj.finalDegreeMarkSheet;
    userDoc.allOtherAcademicDoc = obj.allOtherAcademicDoc;
    userDoc.citizenship = obj.citizenship;
    userDoc.letterOfRecommendation = obj.letterOfRecommendation;
    userDoc.experienceLetter = obj.experienceLetter;
    userDoc.englishResult = obj.englishResult;
    userDoc.cv = obj.cv;
    userDoc.sop = obj.sop;

    await userDoc.save();

    return res.status(200).json({
      msg: 'Document Updated',
    });
  } else {
    obj = {
      passport: passport?.[0].path
        ? passport?.[0].path
        : 'public\\uploads\\notfound.PNG',

      lastAcademicCert: lastAcademicCert?.[0].path
        ? lastAcademicCert?.[0].path
        : 'public\\uploads\\notfound.PNG',

      finalDegreeMarkSheet: finalDegreeMarkSheet?.[0].path
        ? finalDegreeMarkSheet?.[0].path
        : 'public\\uploads\\notfound.PNG',

      allOtherAcademicDoc: allOtherAcademicDoc?.[0].path
        ? allOtherAcademicDoc?.[0].path
        : 'public\\uploads\\notfound.PNG',

      citizenship: citizenship?.[0].path
        ? citizenship?.[0].path
        : 'public\\uploads\\notfound.PNG',

      letterOfRecommendation: letterOfRecommendation?.[0].path
        ? letterOfRecommendation?.[0].path
        : 'public\\uploads\\notfound.PNG',

      experienceLetter: experienceLetter?.[0].path
        ? experienceLetter?.[0].path
        : 'public\\uploads\\notfound.PNG',

      englishResult: englishResult?.[0].path
        ? englishResult?.[0].path
        : 'public\\uploads\\notfound.PNG',

      cv: cv?.[0].path ? cv?.[0].path : 'public\\uploads\\notfound.PNG',
      sop: sop?.[0].path ? sop?.[0].path : 'public\\uploads\\notfound.PNG',
    };

    try {
      const doc = await UserDocumentGallery.create({
        user: req.user._id,
        ...obj,
      });

      if (doc) {
        return res.status(201).json({
          msg: 'Document Added',
        });
      }
    } catch (error) {
      return res.status(400).send({
        err: error,
        msg: error.message,
      });
    }
  }
});

router.get('/', async (req, res) => {
  const userDoc = await UserDocumentGallery.findOne({ user: req.user._id });

  if (userDoc) {
    res.status(200).json({
      data: userDoc,
    });
  }
});

module.exports = router;
