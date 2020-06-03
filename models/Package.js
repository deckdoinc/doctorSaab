const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
	name: String,
	description: String,
	type: String,
	gender: String,
	minage : Number,
	maxage : Number,
	cities:[ String ],
	startdate: Date,
	enddate: Date,
	price: Number,
	tests: [ { 
		name: String,
		price: Number,
	}],
	notes: String,
}, {timestamps : true});

const Package = mongoose.model('Package', PackageSchema);
module.exports = Package;
