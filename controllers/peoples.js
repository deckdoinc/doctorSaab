const People = require('../models/People');
const Dropdown = require('../helpers/dropdown.json');

exports.getAddUpdate = (req, res) => {
	if(req.params.id) {
		People.findById(req.params.id, (err, result) => {
			if(err) throw err;
			result.genders = Dropdown.genders;
			result.peopletypes = Dropdown.peopletypes;
			result.cities = Dropdown.cities;
			result.isactive = Dropdown.isactive;
			res.render('people/update', {peopleAttr: result});
		});
	} else {
		let peopleHref = Dropdown; 
		res.render('people/add', { peopleAttr: peopleHref });
	}
}

exports.postAddUpdate = (req, res) => {
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

	if(req.params.id) {
		People.findByIdAndUpdate(req.params.id, peopleHref, (err) => {
			if(err) {
				req.flash('errors', { msg: 'People update failed. Please contact your administrator'});
				res.redirect(req.params.id);
			}else {
				req.flash('success', { msg:'People update submitted successfully'})
				res.redirect(req.params.id)
			}
		});
	} else {
		const person = new People(peopleHref);
		person.save((err) => {
			if(err) {
				req.flash('errors', { msg: 'Failed to submit the request, please try again' });
				res.render('people/add', {peopleAttr: Dropdown});			
			} else {
				console.log(Dropdown);
				req.flash('success', { msg: 'Personnal is successfully added' });
				res.render('people/add', {peopleAttr: Dropdown});
			}
		});
	}
}

exports.getPeopleList = (req, res) => {
	People.find({}, (err, peoples) => {
		if(err) throw err;
		res.render('people/list', {peopleAttr: peoples.reverse()});
	});
}


