const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
	name: String,
	specimen: String,
	type: String,
	minage: Number,
	maxage: Number,
	gender: String,
	isactive: String
}, {timestamps: true});

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;