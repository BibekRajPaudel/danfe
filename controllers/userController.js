const User = require('../models/User');
const { createCustomError, CustomAPIError } = require('../error/custom-error');
const asyncHandler = require('../utils/asyncHandler');
const {generateToken, sendToken} = require('../utils/generateToken');
const CounsellingTime = require('../models/CounsellingTime');
const UpcomingEvent = require('../models/UpcomingEvent');
const Contact = require('../models/Contact');
const catchAsync = require('../utils/asyncHandler');
const CountryUniversitySchema = require('../models/CountryUniversitySchema');
const StudentFeedback = require('../models/StudentFeedback');
const errorHandler = require('../middleware/error-handler');
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

// Description - Register a new user
// Route - POST /api/users
// Access - Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    contactNumber,
    email,
    password,
    confirmPassword,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new CustomAPIError('User already exists', 400);
  }

  if (password !== confirmPassword) {
    throw new CustomAPIError(
      "Password and Confirm Password doesn't match",
      400
    );
  }

  const user = await User.create({
    firstName,
    lastName,
    contactNumber,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // token: generateToken(user._id),
    });
  }
});

// @description - LOGIN | Authenticate user & Get Token
// @route - POST /api/users/login
// @access - Public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    throw createCustomError('Invalid Email and Password Combination', 401);
  }
});

//@description - Forgot Password 
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({email:req.body.email})

  if (!user){
    throw createCustomError("User not found", 404 )
  }

  //Get reset password token
  const resetToken = user.getResetPasswordToken()
  
  await user.save({validateBeforeSave:false})

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
    
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(createCustomError(error.message, 500));
  }

  })

  //Reset Password
  const resetPassword = asyncHandler(async (req, res, next) => {
      // creating token hash
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    
      if (!user) {
        return next(
          createCustomError(
            "Reset Password Token is invalid or has been expired",
            400
          )
        );
      }
    
      if (req.body.password !== req.body.confirmPassword) {
        return next(createCustomError("Password does not match", 400));
      }
    
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
    
      await user.save();
    
      sendToken(user, 200, res);
    });








const addCounsellingTime = asyncHandler(async (req, res, next) => {
  const counselling = await CounsellingTime.create({
    ...req.body,
  });

  if (counselling) {
    res.status(201).json({
      msg: 'Successfully booked counselling session',
      data: counselling,
    });
  }
});

// @description - Get all upcoming events
// @route - POST /api/users/upcomingevents
// @access - Public
const getUpcomingEvent = asyncHandler(async (req, res, next) => {
  const upcomingEvents = await UpcomingEvent.find({});

  if (upcomingEvents) {
    res.status(200).json({
      upcomingEvents,
    });
  }
});

// @description - Get all upcoming events
// @route - POST /api/users/upcomingevents/:id
// @access - Public
const getSingleUpcomingEvent = asyncHandler(async (req, res, next) => {
  const upcomingEvent = await UpcomingEvent.findById(req.params.id);

  if (upcomingEvents) {
    res.status(200).json({
      upcomingEvent,
    });
  } else {
    res.status(400).json({
      msg: 'Something went wrong',
    });
  }
});

// Description - Save Event
// Route - POST /api/users/counselling
// Access - Private
const addCounselling = asyncHandler(async (req, res, next) => {
  // const userId = req.user._id;

  // const { title, time, date, details, image, _id } = req.body;

  const event = await CounsellingTime.create({
    ...req.body,
    user: _id,
  });

  if (event) {
    res.status(201).json({
      msg: 'Event Created!',
    });
  }
});

// Description - Request a call
// Route - POST /api/users/request
// Access - Private
const requestACall = asyncHandler(async (req, res, next) => {
  const request = await Contact.create({
    ...req.body,
  });

  if (request) {
    res.status(200).json({
      msg: 'Request made successfully!',
    });
  }
});

// Description - Get personal details
// Route - GET /api/users/personaldetails
// Access - Private
const getPersonalDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      contactNumber: user.contactNumber,
      temporaryAddress: user.temporaryAddress,
      permanentAddress: user.permanentAddress,
    });
  }
});

// Description - Get personal details
// Route - PATCH /api/users/personaldetails
// Access - Private
const editPersonalDetails = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body, isAdmin: false },
    {
      runValidators: true,
      new: true,
    }
  );

  if (user) {
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      contactNumber: user.contactNumber,
      temporaryAddress: user.temporaryAddress,
      permanentAddress: user.permanentAddress,
    });
  }
});

// Description - Get academic details
// Route - GET /api/users/academicdetails
// Access - Private
const getAcademicDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      data: user.academicDetails ? user.academicDetails : [],
    });
  }
});

// Description - Get academic details
// Route - GET /api/users/academicdetails/:id
// Access - Private
const getOneAcademicDetail = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error('Please pass id');

  const user = await User.findById(req.user._id);
  console.log(req.params.id);
  const academic = user.academicDetails.find(
    x => x._id.toString() === req.params.id
  );

  if (academic) {
    res.status(200).json({
      academic,
    });
  } else {
    res.status(400).json({
      msg: 'Sorry something went wrong. Maybe you supplied wrong id?',
    });
  }
});

// Description - Add academic details
// Route - POST /api/users/academicdetails
// Access - Private
const addAcademicDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.academicDetails.push({
    ...req.body,
  });

  await user.save();

  res.status(201).json({
    data: user.academicDetails,
  });
});

// Description - Edit academic details
// Route - PATCH /api/users/academicdetails/:id
// Access - Private
const editAcademicDetails = asyncHandler(async (req, res) => {
  const academicDetailsId = req.params.id;

  const user = await User.findOne({ _id: req.user._id });

  if (user) {
    const academicDetails = [...user.academicDetails];

    console.log(academicDetails);

    const academicDetail = academicDetails.find(
      x => x._id.toString() === academicDetailsId
    );

    console.log(academicDetail);

    academicDetail.schoolName =
      req.body.schoolName || academicDetail.schoolName;
    academicDetail.degree = req.body.degree || academicDetail.degree;
    academicDetail.fieldOfStudy =
      req.body.fieldOfStudy || academicDetail.fieldOfStudy;
    academicDetail.startDate = req.body.startDate || academicDetail.startDate;
    academicDetail.endDate = req.body.endDate || academicDetail.endDate;

    await user.save();

    res.status(200).json({
      msg: 'Academic Detail Update Successfully',
    });
  }
});

// Description - Add academic details
// Route - POST /api/users/experiencedetails
// Access - Private
const addExperienceDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.experienceDetails.push({
    ...req.body,
  });

  await user.save();

  res.status(201).json({
    data: user.experienceDetails,
  });
});

// Description - Get academic details
// Route - GET /api/users/experiencedetails
// Access - Private
const getExperienceDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      data: user.experienceDetails ? user.experienceDetails : [],
    });
  }
});

// Description - Get academic details
// Route - GET /api/users/experiencedetails/:id
// Access - Private
const getOneExperienceDetail = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error('Please pass id');

  const user = await User.findById(req.user._id);

  const experience = user.experienceDetails.find(x => x._id === req.params.id);

  if (experience) {
    res.status(200).json({
      experience,
    });
  } else {
    res.status(400).json({
      msg: 'Sorry something went wrong. Maybe you supplied wrong id?',
    });
  }
});

// Description - Edit academic details
// Route - PATCH /api/users/experiencedetails/:id
// Access - Private
const editExperienceDetails = asyncHandler(async (req, res) => {
  const experienceDetailsId = req.params.id;

  const user = await User.findOne({ _id: req.user._id });

  if (user) {
    const experienceDetails = [...user.experienceDetails];

    const experienceDetail = experienceDetails.find(
      x => x._id.toString() === experienceDetailsId
    );

    console.log(experienceDetail);

    experienceDetail.jobTitle = req.body.jobTitle || experienceDetail.jobTitle;
    experienceDetail.employmentType =
      req.body.employmentType || experienceDetail.employmentType;
    experienceDetail.companyName =
      req.body.companyName || experienceDetail.companyName;
    experienceDetail.companyAddress =
      req.body.companyAddress || experienceDetail.companyAddress;
    experienceDetail.companyJoinDate =
      req.body.companyJoinDate || experienceDetail.companyJoinDate;
    experienceDetail.companyLeaveDate =
      req.body.companyLeaveDate || experienceDetail.companyLeaveDate;

    await user.save();

    res.status(200).json({
      msg: 'Experience Detail Update Successfully',
    });
  }
});

// Description - Get academic details
// Route - GET /api/users/testdetails
// Access - Private
const getTestDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      data: user.testScores ? user.testScores : [],
    });
  }
});

// Description - Add academic details
// Route - POST /api/users/testdetails
// Access - Private
const addTestDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.testScores.push({
    ...req.body,
  });

  await user.save();

  res.status(201).json({
    msg: 'Test score added',
  });
});

// Description - Edit academic details
// Route - PATCH /api/users/testdetails/:id
// Access - Private
const editTestDetails = asyncHandler(async (req, res) => {
  const testDetailId = req.params.id;

  const user = await User.findOne({ _id: req.user._id });

  if (user) {
    const testScores = [...user.testScores];

    console.log(testScores);

    const testScore = testScores.find(x => x._id.toString() === testDetailId);

    console.log(testScore);

    testScore.exam = req.body.exam || testScore.exam;
    testScore.score = req.body.score || testScore.score;
    testScore.attemptedDate = req.body.attemptedDate || testScore.attemptedDate;

    await user.save();

    res.status(200).json({
      msg: 'Test Detail Updated Successfully',
    });
  }
});

// Description - Get academic details
// Route - GET /api/users/academicdetails/:id
// Access - Private
const getOneTestDetail = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error('Please pass id');

  const user = await User.findById(req.user._id);

  const test = user.testScores.find(x => x._id === req.params.id);

  if (test) {
    res.status(200).json({
      test,
    });
  } else {
    res.status(400).json({
      msg: 'Sorry something went wrong. Maybe you supplied wrong id?',
    });
  }
});

// Description - Get academic details
// Route - GET /api/users/countryuni
// Access - Private
const getPreferredCountryAndUniDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      data: user.preferredCountryAndUni ? user.preferredCountryAndUni : [],
    });
  }
});

// Description - Add academic details
// Route - POST /api/users/countryuni
// Access - Private
const addPreferredCountryAndUniDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.preferredCountryAndUni.push({
    ...req.body,
  });

  await user.save();

  res.status(201).json({
    msg: 'Country and University details added',
  });
});

// Description - Edit academic details
// Route - PATCH /api/users/countryuni/:id
// Access - Private
const editPreferredCountryAndUniDetails = asyncHandler(async (req, res) => {
  const countriesAndUnisId = req.params.id;

  const user = await User.findOne({ _id: req.user._id });

  if (user) {
    const countriesAndUnis = [...user.preferredCountryAndUni];

    console.log(countriesAndUnis);

    const countryAndUni = countriesAndUnis.find(
      x => x._id.toString() === countriesAndUnisId
    );

    console.log(countryAndUni);

    countryAndUni.country = req.body.country || countryAndUni.country;
    countryAndUni.university = req.body.university || countryAndUni.university;
    countryAndUni.course = req.body.course || countryAndUni.course;
    countryAndUni.intake = req.body.intake || countryAndUni.intake;
    countryAndUni.budget = req.body.budget || countryAndUni.budget;
    countryAndUni.scholarship =
      req.body.scholarship || countryAndUni.scholarship;

    await user.save();

    res.status(200).json({
      msg: 'Country And University Detail Updated Successfully',
    });
  }
});

// Description - Get academic details
// Route - GET /api/users/academicdetails/:id
// Access - Private
const getOnePreferredCountryAndUniDetail = asyncHandler(async (req, res) => {
  if (!req.params.id) throw new Error('Please pass id');

  const user = await User.findById(req.user._id);

  const c = user.preferredCountryAndUni.find(x => x._id === req.params.id);

  if (c) {
    res.status(200).json({
      test,
    });
  } else {
    res.status(400).json({
      msg: 'Sorry something went wrong. Maybe you supplied wrong id?',
    });
  }
});

// Description -  Add feedback
// Route - GET /api/users/feedback
// Access - Private
const getUserFeedback = catchAsync(async (req, res) => {
  const fback = await StudentFeedback.findOne({ userId: req.user._id }).select(
    '-showInHomePage'
  );
  console.log(fback);

  if (fback) {
    return res.status(200).json({
      fback,
    });
  } else {
    return res.status(200).json({
      msg: 'Something went wrong',
    });
  }
});

// Description -  Add feedback
// Route - POST /api/users/feedback
// Access - Private
const addFeedback = asyncHandler(async (req, res) => {
  if (!req.body.feedback)
    return res.status(400).json({
      msg: 'Please add feedback before submitting',
    });

  const feedback = await StudentFeedback.create({
    userId: req.user._id,
    feedback: req.body.feedback,
  });

  if (feedback) {
    return res.status(201).json({
      msg: 'Feedback Added',
    });
  } else {
    return res.status(201).json({
      msg: 'Failed to Add Feedback',
    });
  }
});

// Description -  Add feedback
// Route - PATCH /api/users/feedback
// Access - Private
const editFeedback = catchAsync(async (req, res) => {
  const fback = await StudentFeedback.findOne({ userId: req.user._id });
  console.log(fback);
  if (fback) {
    fback.feedback = req.body.feedback || fback.feedback;
    await fback.save();

    return res.status(200).json({
      msg: 'Feedback Updated',
    });
  } else {
    return res.status(200).json({
      msg: 'Failed to update feedback',
    });
  }
});

// Description - Add University
// Route - GET /api/users/university
// Access - Private
const getUniversities = catchAsync(async (req, res, next) => {
  let ITEMS_PER_PAGE = 6;

  let isGradDegAvailable = false;
  let isUnderGradDegAvailable = false;

  if (!req.query.graddeg && !req.query.undergraddeg) {
    const count = await CountryUniversitySchema.count({});
    const unis = await CountryUniversitySchema.find({});

    if (!unis) {
      throw new Error('Cannot get universities, Please try again later.');
    }

    return res.status(200).json({
      universities: unis,
      // page,
      // pages: Math.ceil(count / ITEMS_PER_PAGE),
    });
  }

  if (req.query.graddeg && req.query.graddeg === 'true') {
    isGradDegAvailable = Boolean(req.query.graddeg);
  } else {
    isGradDegAvailable = false;
  }

  if (req.query.undergraddeg && req.query.undergraddeg === 'true') {
    isUnderGradDegAvailable = Boolean(req.query.undergraddeg);
  } else {
    isUnderGradDegAvailable = false;
  }

  console.log('Test: ', isGradDegAvailable, isUnderGradDegAvailable);

  // const page = Number(req.query.pageNumber) || 1;

  // const count = await CountryUniversitySchema.count({});
  // const unis = await CountryUniversitySchema.find({})
  //   .limit(ITEMS_PER_PAGE)
  //   .skip(ITEMS_PER_PAGE * (page - 1));

  // if (!unis) {
  //   throw new Error('Cannot get universities, Please try again later.');
  // }

  // res.status(200).json({
  //   universities: unis,
  //   page,
  //   pages: Math.ceil(count / ITEMS_PER_PAGE),
  // });

  // If no query passed then return paginated data without filtering.
  if (!isGradDegAvailable && !isUnderGradDegAvailable) {
    const count = await CountryUniversitySchema.count({});
    const unis = await CountryUniversitySchema.find({});

    if (!unis) {
      throw new Error('Cannot get universities, Please try again later.');
    }

    return res.status(200).json({
      universities: unis,
      // page,
      // pages: Math.ceil(count / ITEMS_PER_PAGE),
    });
  }

  if (isGradDegAvailable && !isUnderGradDegAvailable) {
    const unis = await CountryUniversitySchema.find({});
    // .limit(ITEMS_PER_PAGE)
    // .skip(ITEMS_PER_PAGE * (page - 1));

    if (!unis) {
      throw new Error('Cannot get universities, Please try again later.');
    }

    const filteredUni = unis.filter(
      x => x.undergraduateDegreeOffered.length === 0
    );
    console.log('Grad available, undergrad not available', filteredUni);
    return res.status(200).json({
      universities: filteredUni,
      // page,
      // pages: Math.ceil(count / ITEMS_PER_PAGE),
    });
  }

  if (!isGradDegAvailable && isUnderGradDegAvailable) {
    const unis = await CountryUniversitySchema.find({});
    // .limit(ITEMS_PER_PAGE)
    // .skip(ITEMS_PER_PAGE * (page - 1));

    if (!unis) {
      throw new Error('Cannot get universities, Please try again later.');
    }

    const filteredUni = unis.filter(x => x.graduateDegreeOffered.length === 0);

    console.log('Grad notavailable, undergrad available', filteredUni);

    return res.status(200).json({
      universities: filteredUni,
      // page,
      // pages: Math.ceil(count / ITEMS_PER_PAGE),
    });
  }

  if (isGradDegAvailable && isUnderGradDegAvailable) {
    const count = await CountryUniversitySchema.count({});
    const unis = await CountryUniversitySchema.find({});
    // .limit(ITEMS_PER_PAGE)
    // .skip(ITEMS_PER_PAGE * (page - 1));

    if (!unis) {
      throw new Error('Cannot get universities, Please try again later.');
    }

    return res.status(200).json({
      universities: unis,
      // page,
      // pages: Math.ceil(count / ITEMS_PER_PAGE),
    });
  }

  return res.status(200).json({
    msg: "Couldn't get data",
  });
});

// Description - Get student feedback
// Route - GET /api/users/studentfeedback
// Access - Private
const getAllStudentFeedback = catchAsync(async (req, res) => {
  const allFeedbacks = await StudentFeedback.find({});

  if (allFeedbacks) {
    return res.status(200).json({
      allFeedbacks,
    });
  } else {
    return res.status(400).json({
      msg: 'Something went wrong, Please try again later',
    });
  }
});

// Description - Get searched unis
// Route - GET /api/users/searchuni
// Access - Public
const getMatchingUnis = catchAsync(async (req, res) => {
  const universities = await CountryUniversitySchema.find({
    universityName: {
      $regex: new RegExp(req.body.universityName, 'i'),
    },
  });

  if (universities) {
    return res.status(200).json({
      universities,
    });
  } else {
    return res.status(400).json({
      msg: 'Please try again later',
    });
  }
});

// Description - Get individual uni details
// Route - GET /api/users/searchuni/:id
// Access - Public
const getSingleUni = catchAsync(async (req, res) => {
  const uni = await CountryUniversitySchema.findById(req.params.id);

  if (uni) {
    return res.status(200).json({
      uni,
    });
  } else {
    throw new Error('Please try again later');
  }
});

module.exports = {
  authUser,
  registerUser,
  addCounsellingTime,
  getUpcomingEvent,
  addCounselling,
  requestACall,
  getPersonalDetails,
  editPersonalDetails,
  getAcademicDetails,
  addAcademicDetails,
  editAcademicDetails,
  addExperienceDetails,
  getExperienceDetails,
  editExperienceDetails,
  getTestDetails,
  addTestDetails,
  editTestDetails,
  getPreferredCountryAndUniDetails,
  addPreferredCountryAndUniDetails,
  editPreferredCountryAndUniDetails,
  getUniversities,
  getOneAcademicDetail,
  getOneExperienceDetail,
  getOneTestDetail,
  getOnePreferredCountryAndUniDetail,
  addFeedback,
  editFeedback,
  getUserFeedback,
  getAllStudentFeedback,
  getSingleUpcomingEvent,
  getMatchingUnis,
  getSingleUni,
  forgotPassword,
  resetPassword
};
