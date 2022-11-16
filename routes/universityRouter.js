const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  addUniversity,
  editUniversities,
  getUni,
  deleteUni,
} = require('../controllers/adminController');
const { admin } = require('../middleware/authMiddleware');
const { provideStorage, fileFilter } = require('../utils/multerStorage');

const FILE_PATH = 'public/uploads/universitybrochure';

const storage = provideStorage(FILE_PATH);

const upload = multer({
  storage,
  fileFilter,
});

router.post('/', admin, upload.single('brochure'), addUniversity);

router.patch('/:id', admin, upload.single('brochure'), editUniversities);

router.get('/:id', admin, getUni);

router.delete('/:id', admin, deleteUni);

module.exports = router;
