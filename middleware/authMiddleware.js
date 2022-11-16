const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (err) {
      console.error(err);
      res.status(401);
      throw new Error('Authorization cancelled, token failed!');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error('Not authorized as an admin!');
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports = { protect, admin };
