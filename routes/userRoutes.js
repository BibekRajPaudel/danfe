const {
  authUser,
  registerUser,
  getUpcomingEvent,
  addCounselling,
  requestACall,
  getPersonalDetails,
  editPersonalDetails,
  getAcademicDetails,
  editAcademicDetails,
  addAcademicDetails,
  getExperienceDetails,
  addExperienceDetails,
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
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = require('express').Router();

// LOGIN AND REGISTER ROUTES
router.route('/login').post(authUser);
router.route('/').post(registerUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

// get upcoming events
router.get('/upcomingevents', getUpcomingEvent);
router.get('/upcomingevents/:id', getSingleUpcomingEvent);

// Schedule counselling sessions
router.post('/counselling', addCounselling);

// Request a call
router.post('/request', requestACall);

// User Profile Routes
// Personal Details
router
  .route('/personaldetails')
  .get(protect, getPersonalDetails)
  .patch(protect, editPersonalDetails);

// Academic Details
router
  .route('/academicdetails')
  .get(protect, getAcademicDetails)
  .post(protect, addAcademicDetails);
router
  .route('/academicdetails/:id')
  .patch(protect, editAcademicDetails)
  .get(protect, getOneAcademicDetail);

// Experience Details
router
  .route('/experiencedetails')
  .get(protect, getExperienceDetails)
  .post(protect, addExperienceDetails);
router
  .route('/experiencedetails/:id')
  .patch(protect, editExperienceDetails)
  .get(protect, getOneExperienceDetail);

// Test Score Details
router
  .route('/testdetails')
  .get(protect, getTestDetails)
  .post(protect, addTestDetails);
router
  .route('/testdetails/:id')
  .patch(protect, editTestDetails)
  .get(protect, getOneTestDetail);

// Preferred Country And University Details
router
  .route('/countryuni')
  .get(protect, getPreferredCountryAndUniDetails)
  .post(protect, addPreferredCountryAndUniDetails);
router
  .route('/countryuni/:id')
  .patch(protect, editPreferredCountryAndUniDetails)
  .get(protect, getOnePreferredCountryAndUniDetail);

// Feedback
router.get('/feedback', protect, getUserFeedback);
router.post('/feedback', protect, addFeedback);
router.patch('/feedback', protect, editFeedback);

// Get universities
router.get('/university', getUniversities);

router.get('/allstudentfeedback', getAllStudentFeedback);

router.post('/searchuni', getMatchingUnis);
router.get('/searchuni/:id', getSingleUni);

module.exports = router;
