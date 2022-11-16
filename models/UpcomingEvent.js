const mongoose = require('mongoose');

//Event page: (name:string),(description:string),(time:string),(date:string)(eventIMG:string)
//(CRUD)(post,get,getByID,edit,delete)

const UpcomingEvent = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  time: {
    type: String,
  },
  date: {
    type: Date,
  },
  eventImg: {
    type: String,
  },
});

module.exports = mongoose.model('UpcomingEvent', UpcomingEvent);
