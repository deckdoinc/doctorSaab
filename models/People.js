const mongoose = require('mongoose');

const PeopleSchema = new mongoose.Schema({
  name: {
    first: String,
    middle: String,
    last: String
  },

  email: String,
  phone: Number,
  gender: String,
  type: String,
  profession: String,
  organization: String,
  education: String,
  licensenumber: String,
  description: String,
  address: {
    address: String,
    nearby: String,
    city: String,
    state: String,
    zipcode: String
  },

  checkups: [
    {
      date: Date,
      patientid: String,
    }
  ],
  status: String,
}, { timestamps: true });

const People = mongoose.model('People', PeopleSchema);
module.exports = People;