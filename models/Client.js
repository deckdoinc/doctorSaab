const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  address: {
    street: String,
    apartment: String,
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

const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;