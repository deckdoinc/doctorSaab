const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: {
    first: String,
    middle: String,
    last: String
  },

  email: String,
  phone: Number,
  dob: Date,
  gender: String,
  address: {
    address: String,
    nearby: String,
    city: String,
    state: String,
    zipcode: String,
  },

  checkups: [
    {
      packages: [
        {
          id:String,
          date: Date,
          tests: [
            {
             id: String,
             labid: String,
             costprice: Number,
             sellprice: Number,
             results:String
            }
          ],
          medoff:[ // medical officials
            { 
              id: String,
              name: String,
              type: String,
              payment: Number,
              notes: String
            }
          ],

          report: String,
          validationreport: String,
          medicines: [
            {
              type: String,
              name: String,
              dosage: String,
              count: String
            }
          ],

          cost: Number,
          misexpenses: Number,
          client: [
            {
              id: String,
              name: String,
              email: String,
              phone: Number,
              state: Number
            }
          ],
          packagenotes: String,
        },
      ],
      checkupnotes: String,
    },
  ],
  status: String,

}, { timestamps: true });

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;