const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
	name: String,
	address: String,
	nearby: String,
	city : String,
	phone: String,
	email: String,
	type: String,
	registration: String,
	tests: [
		{
			name: String,
			specimen: String,
			type: String,
			cprice: Number,
			sprice: Number
		},
	],
	isactive: String
}, { typeKey: '$type' }, {timestamps: true });

const Lab = mongoose.model('Lab', LabSchema);
module.exports = Lab;
