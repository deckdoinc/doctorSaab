const Client = require('../models/Client');
const Patient = require('../models/Patient');
const Dropdown = require('../helpers/dropdown.json');
const utils = require('../emails/utils');
const Email = require('email-templates');

exports.getCreatePatient = (req, res) => {
	console.log("Inside Get Patient");
	res.render('patient/add', {});
}

exports.postCreatePatient = (req, res) => {
	res.render('patient/add', {patientAttr: req.body});
}

exports.postAddPatient = (req, res) => {
	let patientHref = {
		name: {
			first: req.body.firstname,
			middle: req.body.middlename,
			last: req.body.lastname,
		},
		email: req.body.email,
		phone: req.body.phone,
		dob: req.body.dob,
		gender: req.body.gender,
		address: {
			address: req.body.address,
			nearby: req.body.nearby,
			city: req.body.city,
			state: req.body.state,
			zipcode: req.body.zipcode,

		},
		checkups: [],
	};

	const patient = new Patient(patientHref);
	patient.save((err) => {
		if(err) {
			req.flash('errors', { msg: 'Failed to submit the request, please try again' });
			console.log(err);
			res.redirect('requestquote');			
		} else {
			req.flash('success', { msg: 'Patient successfully added' });
			res.render('patient/add', {patientAttr: patientHref});
		}
	});
}

exports.getAddPatient = (req, res) => {
	const patientHref = {};
	res.render('patient/add', { patientAttr: patientHref });
}

exports.getUpdatePatient = (req, res) => {
	console.log(req.params.id);
	Patient.findById(req.params.id, (err, result) => {
		console.log(result);
		res.render('patient/update', {patientAttr: result});
	}); 
}

exports.postUpdatePatient = (req, res) => {
	res.send("Hello world");
}

exports.getPatientList = (req, res) => {
	Patient.find({}, (err, result) => {
		if(err) throw err;
		var patientAref = [];
		for(var i=0; i < result.length; i++) {
			var patientHref = {};     
			patientHref._id = result[i]._id;
			patientHref['name'] = result[i].name.first.concat(" ", result[i].name.middle, " ", result[i].name.last);
			patientHref['email'] = result[i].email;
			patientHref['phone'] = result[i].phone;
			patientHref['address'] = result[i].address.address;
			patientHref['city'] = result[i].address.city;
			//patientHref['checkups'] = result[i].checkups.length;
			patientAref.push(patientHref);
		}

		res.render('patient/patients', {patientAttr: patientAref});
	});
}
