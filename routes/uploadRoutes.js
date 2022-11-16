const express = require('express');
const multer = require('multer');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');

const StudentApplication = require('../models/StudentApplication');
const { admin } = require('../middleware/authMiddleware');
const formValidation = require('../utils/formValidation');

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.pdf' && ext !== '.docx') {
      return callback(new Error('Only pdf or docx are allowed'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1000 * 1000,
  },
});

var uploadMultiple = upload.fields([
  //   { name: 'file1', maxCount: 1 },
  //   { name: 'file2', maxCount: 8 },
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

const requiredFileCheck = req => {
  console.log(req.files);
  if (
    !req.files.citizenship ||
    !req.files.lastAcademicCert ||
    !req.files.finalDegreeMarkSheet
  ) {
    return false;
  }

  return true;
};

// STUDENT APPLICATION SUBMISSTION ROUTE
router.post('/', uploadMultiple, formValidation, async (req, res) => {
  if (!requiredFileCheck(req)) {
    console.log('inside ');
    return res
      .status(400)
      .send(
        'Citizenship, Last academic degree certification and final degree mark sheet should be submitted!'
      );
  }

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

  const obj = {
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
    const user = await StudentApplication.create({
      ...req.body,
      ...obj,
    });

    console.log('Student application created: ', user);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.firstName,
      });
    }
  } catch (error) {
    return res.status(400).send({
      err: error,
      msg: error.message,
    });
  }
});

module.exports = router;
