const jwt = require('jsonwebtoken');

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    console.log(options, "options")

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};


module.exports = {
  generateToken,
   sendToken
  };

