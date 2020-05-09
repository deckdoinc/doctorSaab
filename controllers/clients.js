const Client = require('../models/Client');
const Dropdown = require('../helpers/dropdown.json');

exports.requestQuote = (req, res) => {
	res.render('frontend/requestquote', {quoteAttr: Dropdown});
}

exports.getPatientDetail = (req, res) => {
	let output = req.body;
	output['age'] = Dropdown.age;
	output['gender'] = Dropdown.gender;
	res.render('frontend/patientdetail', {clientAttr: output});
}

exports.postSubmitQuote = (req, res) => {
	let clientHref = {
		name: req.body.clientname,
		email: req.body.clientemail,
		phone: req.body.clientphone,
		address: {
			street: req.body.clientstreet,
			apartment: req.body.clientapartment,
			city: req.body.clientcity,
			state: req.body.clientstate,
			zipcode: req.body.zipcode,
		},
		patients: [],
	};

	const totalCustomers = req.body.name.length;
	for(var i=0; i < totalCustomers; i++) {
		const patientName = req.body.name[i];
		const patientAge = req.body.age[i];
		const patientPhone = req.body.phone[i];
		const patientAddress = req.body.address[i];
		const patientPopPlace = req.body.popularplc[i];
		const patientCity = req.body.city[i];
		const patientGender = req.body.gender[i];
		if(!patientName || !patientPhone || !patientAddress) {
			continue;
		}

		clientHref.patients.push({
			name: patientName,
			phone: patientPhone,
			age: patientAge,
			gender: patientGender,
			address: patientAddress,
			nearby: patientPopPlace,
			city: patientCity,
		});
	}

	const client = new Client(clientHref);
	client.save((err) => {
		if(err) {
			req.flash('errors', { msg: 'Failed to submit the request, please try again' });
			res.redirect('requestquote');			
		} else {
			req.flash('success', { msg: 'Thank you for submiting your request, we will be in touch with your quote price' });
			res.redirect('requestquote');
		}
	});
}

exports.getClientList = (req, res) => {
	console.log("Here");
	Client.find({}, (err, result) => {
		if(err) throw err;
		var clientArrHref = [];
		for(var i=0; i < result.length; i++) {
			var clientHref = {};
			clientHref['name'] = result[i].name;
			clientHref['email'] = result[i].email;
			clientHref['phone'] = result[i].phone;
			clientHref['state'] = result[i].state;
			clientHref['ttlpatients'] = result[i].patients.length;
			clientArrHref.push(clientHref);
		}

		res.render('clients/admin/clients', {clientsAttr: clientArrHref});
	});
}
