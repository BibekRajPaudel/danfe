const formValidation = (req, res, next) => {
  console.log(req.body);
  if (!req.body.hearAboutUs) {
    return res.status(400).json({
      msg: 'Hear about us should not be empty',
    });
  }

  if (!req.body.interestedUniversity) {
    return res.status(400).json({
      msg: 'Interested University should not be empty',
    });
  }
  if (!req.body.interestedCountry) {
    return res.status(400).json({
      msg: 'Interested Country should not be empty',
    });
  }
  if (!req.body.attemptedDate) {
    return res.status(400).json({
      msg: 'Attempted Date should not be empty',
    });
  }
  if (!req.body.score) {
    return res.status(400).json({
      msg: 'Score should not be empty',
    });
  }

  if (!req.body.startDate) {
    return res.status(400).json({
      msg: 'Start Date should not be empty',
    });
  }
  if (!req.body.courseOfStudy) {
    return res.status(400).json({
      msg: 'Couse of study should not be empty',
    });
  }
  if (!req.body.nameOfInstitution) {
    return res.status(400).json({
      msg: 'Name of Institution should not be empty',
    });
  }
  if (!req.body.passportNumber) {
    return res.status(400).json({
      msg: 'Passport number should not be empty',
    });
  }
  if (!req.body.citizenShipNumber) {
    return res.status(400).json({
      msg: 'Citizenship Number should not be empty',
    });
  }
  if (!req.body.dateOfBirth) {
    return res.status(400).json({
      msg: 'Date of birth should not be empty',
    });
  }
  if (!req.body.gender) {
    return res.status(400).json({
      msg: 'Gender should not be empty',
    });
  }
  if (!req.body.contactNumber) {
    return res.status(400).json({
      msg: 'Contact number should not be empty',
    });
  }
  if (!req.body.email) {
    return res.status(400).json({
      msg: 'Email should not be empty',
    });
  }

  next();
};

module.exports = formValidation;
