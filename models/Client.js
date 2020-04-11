const mongoose = require('mongoose');

const Client = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  address: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipcode: String,
  },

  patients : [
    {
      name: String,
      phone: Number,
      age  : Number,
      gender : String,
      address: String,
      nearby : String,
      city   : String,
      packages: [{
        type : String,
        name : String,
        city : String
      }]
    }
  ]
}, { timestamps: true });


module.exports = Client;