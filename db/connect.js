const mongoose = require('mongoose');

const connectDB = uri => {
  return mongoose.connect("mongodb+srv://root:DSXpZCac3EyQhEKg@cubeq.xwb8fbj.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
