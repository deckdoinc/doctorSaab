const mongoose = require('mongoose');

const Packages = new mongoose.Schema({
	name: String,
	type: String,
	agegroup: String,
	tests: [ { id: String }	]
}, {timestamps : true});

module.exports = Packages;

