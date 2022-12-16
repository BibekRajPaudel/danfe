const Contact = require('../models/Contact');
const CounsellingTime = require('../models/CounsellingTime');
const CountryUniversitySchema = require('../models/CountryUniversitySchema');
const StudentApplication = require('../models/StudentApplication');
const StudentFeedback = require('../models/StudentFeedback');
const UpcomingEvent = require('../models/UpcomingEvent');
const catchAsync = require('../utils/asyncHandler');

// Description - Add an event
// Route - POST /api/admin
// Access - Private
const addUpcomingEvent = catchAsync(async (req, res, next) => {
  const isCreated = await UpcomingEvent.create({
    ...req.body,
  });

  console.log(isCreated);

  if (isCreated) {
    res.status(201).json({
      msg: 'Upcoming Event created',
    });
  }
});

// Description - Get all student applications
// Route - GET /api/admin/studentapplication
// Access - Private
const getStudentApplications = catchAsync(async (req, res, next) => {
  const applications = await StudentApplication.find({});

  res.status(200).json({
    data: applications,
  });
});

const addUniversity = catchAsync(async (req, res) => {
  
  const countryuni = await CountryUniversitySchema.create({
    ...req.body,
  });

  if (countryuni) {
    res.status(201).json({
      msg: 'Country and University Added Successfully!',
      countryuni,
    });
  }
});

// Description - Get counselling of all students
// Route - POST /api/admin/university
// Access - Private
const getCounselling = catchAsync(async (req, res, next) => {
  const counsellings = await CounsellingTime.find({});

  if (counsellings) {
    res.status(200).json({
      data: counsellings,
    });
  }
});

// Description - Get Universities
// Route - GET /api/admin/university
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

// Description - Add University
// Route - PATCH /api/admin/university/:id
// Access - Private
const editUniversities = catchAsync(async (req, res, next) => {
  const uniId = req.params.id;
  const file = req.file;
  console.log(req.body, uniId);
  if (!uniId) throw new Error('No id found');

  const u = await CountryUniversitySchema.findById(uniId);

  const uni = await CountryUniversitySchema.findByIdAndUpdate(
    uniId,
    {
      ...req.body,
      brochureDownloadLink: file.path ? file.path : u.brochureDownloadLink,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    uni,
  });
});

// Description - Get single university
// Route - GET /api/admin/university/:id
// Access - Private
const getUni = catchAsync(async (req, res) => {
  const e = CountryUniversitySchema.findById(req.params.id);

  if (e) {
    return res.status(200).json({
      e,
    });
  } else {
    return res.status(400).json({
      msg: 'Something went wrong',
    });
  }
});

// Description - Get single university
// Route - DELETE /api/admin/university/:id
// Access - Private
const deleteUni = catchAsync(async (req, res) => {
  const uni = await CountryUniversitySchema.findById(req.params.id);

  if (uni) {
    await CountryUniversitySchema.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      msg: 'Univesity Removed Successfully',
    });
  } else {
    return res.status(400).json({
      msg: 'Something went wrong',
    });
  }
});

// UPCOMING EVENT CONTROLLERS

// Add event
// Description - Add an event
// Route - POST /api/admin/upcomingevent
// Access - Private
const addAnEvent = catchAsync(async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No image in the request');

  const event = await UpcomingEvent.create({
    ...req.body,
    eventImg: file.path,
  });

  if (event) {
    res.status(200).json({
      msg: 'Event added!',
    });
  }
});

// Get all upcoming event
// Description - Get all events
// Route - GET /api/admin/upcomingevent
// Access - Private
const getAllEvent = catchAsync(async (req, res) => {
  const events = await UpcomingEvent.find({});

  if (events) {
    res.status(200).json({
      events,
    });
  }
});

// Get one upcoming event
// Description - Get all events
// Route - GET /api/admin/upcomingevent/:id
// Access - Private
const getSingleEvent = catchAsync(async (req, res) => {
  const event = await UpcomingEvent.findById(req.params.id);

  if (event) {
    return res.status(200).json({
      event,
    });
  } else {
    return res.status(400).json({
      msg: 'Something went wrong',
    });
  }
});

// Edit Event
// Description - Edit an event
// Route - PATCH /api/admin/upcomingevent/:id
// Access - Private
const editEvent = catchAsync(async (req, res) => {
  const event = await UpcomingEvent.findById(req.params.id);

  if (event) {
    if (req.file) {
      await UpcomingEvent.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          eventImg: req.file.path,
        },
        {
          runValidators: true,
          new: true,
        }
      );

      return res.status(200).json({
        msg: 'Meet Updated',
      });
    } else {
      await UpcomingEvent.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );

      return res.status(200).json({
        msg: 'Meet Updated',
      });
    }
  } else {
    res.status(400).json({
      msg: 'Something went wrong, Please try again later.',
    });
  }
});

// Delete an event
// Description - Edit an event
// Route - PATCH /api/admin/upcomingevent/:id
// Access - Private
const deleteEvent = catchAsync(async (req, res) => {
  const event = UpcomingEvent.findById(req.params.id);

  if (event) {
    const e = await UpcomingEvent.findByIdAndRemove(req.params.id);

    return res.status(200).json({
      msg: 'Event removed successfully!',
    });
  } else {
    return res.status(400).json({
      msg: 'Sorry, something went wrong. Please try again later.',
    });
  }
});

// ADMIN VIEW: SEE USER'S REQUEST FOR CALL AND DELETE

// Description - View all call request
// Route - PATCH /api/admin/contact
// Access - Private
const seeAllUserRequest = catchAsync(async (req, res) => {
  const allRequests = await Contact.find({});

  if (allRequests) {
    return res.status(200).json({
      allRequests,
    });
  } else {
    return res.status(400).json({
      msg: 'Something went wrong',
    });
  }
});

// Description - View all call request
// Route - DELETE /api/admin/contact/:id
// Access - Private
const deleteARequest = catchAsync(async (req, res) => {
  const del = await Contact.findById(req.params.id);

  if (del) {
    await Contact.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      msg: 'Request removed successfully!',
    });
  } else {
    return res.status(400).json({
      msg: 'Something went wrong',
    });
  }
});

// Description - View all student applications
// Route - GET /api/admin/studentapplication
// Access - Private
const getAllStudentApplications = catchAsync(async (req, res) => {
  const stdApplications = await StudentApplication.find({});

  if (stdApplications) {
    return res.status(200).json({
      stdApplications,
    });
  } else {
    return res.status(400);
  }
});

// Description - View single student application
// Route - GET /api/admin/studentapplication/:id
// Access - Private
const getSingleStudentApplication = catchAsync(async (req, res) => {
  const stdApplicaton = await StudentApplication.findById(req.params.id);

  if (stdApplicaton) {
    return res.status(200).json({
      stdApplicaton,
    });
  } else {
    return res.status(400).json({
      msg: 'Something went wrong',
    });
  }
});

// Description - Delete student application
// Route - DELETE /api/admin/studentapplication/:id
// Access - Private
const deleteAStudentApplication = catchAsync(async (req, res) => {
  const st = await StudentApplication.findById(req.params.id);

  if (st) {
    await StudentApplication.findByIdAndRemove(req.params.id);

    return res.status(200).json({
      msg: 'Student application removed!',
    });
  } else {
    return res.status(400).json({
      msg: 'Something went wrong',
    });
  }
});

// Description - Get student feedback
// Route - GET /api/admin/studentfeedback
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

// Description - show or not show student feedback
// Route - PATCH /api/admin/studentfeedback/:id
// Access - Private
const showStudentFeedback = catchAsync(async (req, res) => {
  const feedback = await StudentFeedback.findById(req.params.id);

  if (feedback) {
    feedback.showInHomePage =
      req.body.showInHomePage || feedback.showInHomePage;
    await feedback.save();

    res.status(200).json({
      msg: 'Feedback Show Status Updated',
    });
  } else {
    return res.status(200).json({
      msg: 'Feedback Show Status Update Failed',
    });
  }
});

module.exports = {
  addUniversity,
  getStudentApplications,
  addUpcomingEvent,
  getCounselling,
  getUniversities,
  getUni,
  deleteUni,
  editUniversities,
  addAnEvent,
  getAllEvent,
  getSingleEvent,
  editEvent,
  deleteEvent,
  seeAllUserRequest,
  deleteARequest,
  getAllStudentApplications,
  getSingleStudentApplication,
  deleteAStudentApplication,
  getAllStudentFeedback,
  showStudentFeedback,
};
