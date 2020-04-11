const DropDown = require("../helpers/dropdown.json");
const Test = require("../models/Test.js");
const Lab  = require("../models/Lab.js");

exports.getAdminLabs = (req, res) => {
	Lab.find({}, (err, labs) => {
		if(err) throw err;
		res.render("labs/admin/labs", {labsAttr: labs});
	});
}

exports.getAddUpdate = (req, res) => {
	if(req.params.id) {

	} else {
		Test.find({isactive: 'active'}, (err, tests) => {
			if (err) throw err;
			DropDown["tests"] = tests;
			res.render("labs/admin/addlab", { labAttr: DropDown});
		});
	}
}

exports.postAddUpdate = (req, res) => {
	if(req.params.id) {

	} else {
		const lab = new Lab(req.body);
		lab.save((err) => {
			if (err) {
			  req.flash('errors', { msg: 'Your test could not be submitted. Please fill out correct information' });
			  res.redirect('addlab');
			} else {
			  req.flash('success', { msg: 'Your test was submitted successfully' });
			  res.redirect('addlab');
			}
		});
	}
}

