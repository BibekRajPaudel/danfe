const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const multer = require('multer');
var cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/connect');
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const userRouter = require('./routes/userRoutes');
const uploadRouter = require('./routes/uploadRoutes');
// const eventRouter = require('./routes/eventRouter');
const adminRouter = require('./routes/adminRouter');
const userProfilePicRouter = require('./routes/userProfilePhotoRoute');
const documentGalleryRouter = require('./routes/documentGalleryRoute');
const upcomingEventRouter = require('./routes/upcomingEventRouter');
const universityRouter = require('./routes/universityRouter');
const { protect } = require('./middleware/authMiddleware');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
// app.use(multer().any());

app.get('/', (req, res, next) => {
  res.send('Server started !!!!!!!!!!');
});

app.use('/api/users', userRouter);
app.use('/api/studentapplication', protect, uploadRouter);
// Upcoming event add | Admin
app.use('/api/admin/upcomingevent', protect, upcomingEventRouter);
app.use('/api/admin', adminRouter);

// User profile photo upload route
app.use('/api/users/profilepic', protect, userProfilePicRouter);

// User profile document upload route
app.use('/api/users/documentgallery', protect, documentGalleryRouter);

// Univerity Add Route
app.use('/api/admin/university', protect, universityRouter);

app.use(
  '/public/uploads',
  express.static(path.join(__dirname, '/public/uploads'))
);

app.use(
  '/public/uploads/userprofiledocs',
  express.static(path.join(__dirname, '/public/uploads/userprofiledocs'))
);

app.use(
  '/public/uploads/userprofiledocs',
  express.static(path.join(__dirname, '/public/uploads/universitybrochure'))
);
app.use(
  '/public/uploads/userprofiledocs',
  express.static(path.join(__dirname, '/public/uploads/upcomingeventpics'))
);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is listening on Port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
})();
