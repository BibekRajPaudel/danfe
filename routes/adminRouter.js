const {
  getStudentApplications,
  addUpcomingEvent,
  addUniversity,
  getCounselling,
  getUniversities,
  editUniversities,
  seeAllUserRequest,
  deleteARequest,
  getAllStudentApplications,
  getSingleStudentApplication,
  deleteAStudentApplication,
  getAllStudentFeedback,
  showStudentFeedback,
} = require('../controllers/adminController');
const { authUser } = require('../controllers/userController');
const { admin, protect } = require('../middleware/authMiddleware');
const StudentApplication = require('../models/StudentApplication');

const router = require('express').Router();

// Add upcoming event
// router.post('/upcomingevent', protect, admin, addUpcomingEvent);

// Add university
// router.post('/uni', protect, admin, addUniversity);

// Get all student applications
router.get('/studentapplication', protect, admin, getStudentApplications);

// View all student counselling timing
router.get('/counselling', protect, admin, getCounselling);

// get unis
router.get('/university', protect, admin, getUniversities);
// router.patch('/university/:id', protect, admin, editUniversities);

// View and delete User's call for request
router.get('/contact', protect, admin, seeAllUserRequest);
router.delete('/contact/:id', protect, admin, deleteARequest);

// Student application view for admin
router.get('/studentapplication', protect, admin, getAllStudentApplications);

router
  .route('/studentapplication/:id')
  .get(protect, admin, getSingleStudentApplication)
  .delete(protect, admin, deleteAStudentApplication);

// Student feedback
router.route('/studentfeedback').get(protect, admin, getAllStudentFeedback);
router.route('/studentfeedback/:id').patch(protect, admin, showStudentFeedback);

module.exports = router;
