const Client = require('../models/Client');
const Patient = require('../models/Patient');
const Dropdown = require('../helpers/dropdown.json');
const utils = require('../emails/utils');
const Email = require('email-templates');

exports.requestQuote = (req, res) => {
	res.render('frontend/requestquote', {quoteAttr: Dropdown});
}

exports.getClientDetail = (req, res) => {
	Client.findById(req.params.id, (err, client) => {
		var clientHref = {};
		var matcher = {};
		var allMatches = []
		clientHref['client'] = client;
		clientHref['patients'] = [];
		for(var i=0; i < client.patients.length ; i++) {
			var href = client.patients[i];
			const fullName = href.name.first.concat(" ", href.name.middle, " ", href.name.last);
			matcher[fullName] = {
				href: href,
				matched: 0,
				patientid: '',
			};
		} 

		Patient.find({}, (err, patients) => {
			for(var i = 0; i < patients.length; i++) {
				const href = patients[i];
				const fullName = href.name.first.concat(" ", href.name.middle, " ", href.name.last);
				if(matcher.fullName) {
					matcher.fullname.patientid = href._id;
					matcher.fullname.matched = 1;
					clientHref['patients'].push(matcher);
				}
			}

			for(var fullname in matcher) {
				var href = matcher[fullname];
				if(href['matched'] == 0) {
					clientHref['patients'].push(href)
				}
			}

	 		clientHref.client.usstates = Dropdown.usstates;
			clientHref.client.genderdd = Dropdown.gender;
			clientHref.client.statusclient = Dropdown.statusclient;

			console.log(clientHref);
			res.render("clients/admin/update", {clientAttr: clientHref});
		});
	});
}

exports.getPatientDetail = (req, res) => {
	let output = req.body;
	output['age'] = Dropdown.age;
	output['gender'] = Dropdown.gender;
	output['status'] = "quoterequest"; // First time request submitted.
	res.render('frontend/patientdetail', {clientHref: output});
}

exports.postSubmitQuote = (req, res) => {
	let clientHref = {
		name : {
			first: req.body.clientfirstname,
			middle: req.body.clientmiddlename,
			last: req.body.clientlastname,
		},
		email: req.body.clientemail,
		phone: req.body.clientphone,
		status: req.body.clientstatus,
		address: {
			street: req.body.clientstreet,
			apartment: req.body.clientapartment,
			city: req.body.clientcity,
			state: req.body.clientstate,
			zipcode: req.body.clientzipcode,
		},
		patients: [],
	};

	 const locals = {
	 	clientname: req.body.clientfirstname.concat(" ", req.body.clientmiddlename, " ", req.body.clientlastname),
	 	patients: [], 
	 };

	
	if(Array.isArray(req.body.firstname)) {
		for(var i=0; i < req.body.firstname.length; i++) {
			var patientHref = {
				name: {
					first: req.body.firstname[i],
					middle: req.body.middlename[i],
					last: req.body.lastname[i],
				},
				phone: req.body.phone[i],
				dob: req.body.dob[i],
				gender: req.body.gender[i],
				address: req.body.address[i],
				nearby: req.body.popularplc[i],
				city: req.body.city[i],				
			};
			
			clientHref.patients.push(patientHref);
			locals.patients.push(patientHref);		
		}	
	} else {
			var patientHref = {
				name: {
					first: req.body.firstname,
					middle: req.body.middlename,
					last: req.body.lastname,
				},
				phone: req.body.phone,
				dob: req.body.dob,
				gender: req.body.gender,
				address: req.body.address,
				nearby: req.body.popularplc,
				city: req.body.city,				
			};


			clientHref.patients.push(patientHref);
			locals.patients.push(patientHref);		
	}

	const client = new Client(clientHref);
	client.save((err) => {
		if(err) {
			req.flash('errors', { msg: 'Failed to submit the request, please try again' });
			console.log(err);
			res.redirect('requestquote');			
		} else {
			req.flash('success', { msg: 'Thank you for submiting your request, we will be in touch with your quote price' });
  			const subject = "Quote Request : We will be in touch - DoctorSaab";
  			const receiver = req.body.clientemail;
			const emailBody = new Email();
		  	emailBody
		    	.render('../emails/quote-email.pug', locals)
		    	.then((html) => {
		      		utils.sendCustomEmail(subject, receiver, html);
		    	})
		    .catch(console.error);
			res.redirect('requestquote');
		}
	});
}

exports.getClientList = (req, res) => {
	Client.find({}, (err, result) => {
		if(err) throw err;
		var clientArrHref = [];
		for(var i=0; i < result.length; i++) {
			var clientHref = {};

			console.log(result[i].name);
			clientHref._id = result[i]._id;
			clientHref['name'] = result[i].name.first.concat(" ", result[i].name.middle, " ", result[i].name.last);
			clientHref['email'] = result[i].email;
			clientHref['phone'] = result[i].phone;
			clientHref['state'] = result[i].address.state;
			clientHref['ttlpatients'] = result[i].patients.length;
			clientHref['status'] = result[i].status;
			clientArrHref.push(clientHref);
		}

		res.render('clients/admin/list', {clientsAttr: clientArrHref});
	});
}
