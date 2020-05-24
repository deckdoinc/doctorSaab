const People = require('../models/People');
const Dropdown = require('../helpers/dropdown.json');

exports.getAddPeople = (req, res) => {
	let peopleHref = Dropdown; 
	res.render('people/add', { peopleAttr: peopleHref });
}

exports.postAddPeople = (req, res) => {
	const peopleHref = {
		name: {
			first: req.body.firstname,
			middle: req.body.middlename,
			last: req.body.lastname,
		},
		email: req.body.email,
		phone: req.body.phone,
		gender: req.body.gender,
		type: req.body.type,
		profession: req.body.profession,
		organization: req.body.organization,
		education: req.body.education,
		licensenumber: req.body.licensenumber,
		description: req.body.description,
		address: {
			address: req.body.address,
			nearby:req.body.nearby,
			city: req.body.city,
			state: req.body.state,
			zipcode: req.body.zipcode,
		},
		status: req.body.status,
		checkups: [],
	};

	const person = new People(peopleHref);
	patient.save((err) => {
		if(err) {
			req.flash('errors', { msg: 'Failed to submit the request, please try again' });
			res.render('people/add', {peopleAttr: Dropdown});			
		} else {
			req.flash('success', { msg: 'Patient successfully added' });
			res.render('people/add', {peopleAttr: Dropdown});
		}
	});

	res.render('people/add', {peopleAttr: peopleHref});
}

exports.getPeopleList = (req, res) => {
	People.find({}, (err, result) => {
		if(err) throw err;
		const peopleHref = {};
		// peopleHref['name'] = result.name.first;
		// peopleHref['phone'] = result.phone;
		// peopleHref['address'] = result.address.address;
		// peopleHref['city'] = result.address.city;
		// peopleHref['type'] = result.type;
		res.render('people/list', {peopleAttr: peopleHref});
	});
}


