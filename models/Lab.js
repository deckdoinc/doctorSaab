const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
	name: String,
	address: String,
	nearby: String,
	city : String,
	phone: String,
	email: String,
	labtype: String,
	registration: String,
	tests: [
		{
			_id: String,
			name: String,
			specimen: String,
			type: String,
			minage: Number,
			minage: Number,
			gender: String,
			cprice: Number,
			sprice: Number
		}
	],
	isactive: String
}, { timestamps: true });

const Lab = mongoose.model('Lab', LabSchema);
module.exports = Lab;
