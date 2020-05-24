const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name : {
    first: String,
    middle: String,
    last: String
  },

  email: String,
  phone: Number,
  address: {
    street: String,
    apartment: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },

  status: String,
  patients : [
    {
      name: {
        first: String,
        middle: String,
        last: String
      },

      match: String,
      phone: Number,
      dob  : Date,
      gender : String,
      address: String,
      nearby : String,
      city   : String
    }
  ],

  payments: [
    { 
      type: String,
      payee: String,
      date: Date,
      amount: Number,
      dollrate: Number
    }
  ]
}, { timestamps: true });

const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;