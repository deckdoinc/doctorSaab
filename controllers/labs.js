const DropDown = require("../helpers/dropdown.json");
const Test = require("../models/Test.js");
const Lab  = require("../models/Lab.js");

exports.getAdminLabs = (req, res) => {
	Lab.find({}, (err, labs) => {
		if(err) throw err;
		res.render("labs/admin/labs", {labsAttr: labs.reverse()});
	});
}

exports.getAddUpdate = (req, res) => {
	if(req.params.id) {
		Lab.findById((req.params.id), (err, lab) => {
			// var labAttr = Object.assign({}, DropDown, labs._doc); This is the way of combinnig 2 hashes
			var labAttr = DropDown;
			labAttr._id = lab._id;
			labAttr.name = lab.name;
			labAttr.address = lab.address;
			labAttr.nearby = lab.nearby;
			labAttr.phone = lab.phone;
			labAttr.email = lab.email;
			labAttr.registration = lab.registration;
			labAttr.slabtype = lab.type;
			labAttr.scity = lab.city
			labAttr.sisactive = lab.isactive;
			labAttr.tests = lab.tests;
			res.render("labs/admin/update", {labAttr: labAttr});
		}); 
	} else {
		Test.find({isactive: 'active'}, (err, tests) => {
			if (err) throw err;
			res.render("labs/admin/add", { labAttr: DropDown});
		});
	}
}

exports.postAddUpdate = (req, res) => {
	if(req.params.id) {
		// We have to make sure all the tests entered are the one available in system.
		Test.find({isactive: 'active'}, (err, tests) => {
			if (err) throw err;
			var href = assignLabAttributes(req, tests);
			Lab.findByIdAndUpdate(req.params.id, href, (err) => {
				if(err) {
					req.flash('errors', { msg: 'Lab update failed. Please contact your administrator'});
					res.redirect(req.params.id);
				}else {
					req.flash('success', { msg:'Lab update submitted successfully'})
					res.redirect(req.params.id)
				}
			});
		});   
	} else {
		Test.find({isactive: 'active'}, (err, tests) => {
			if(err) throw err;
			var href = assignLabAttributes(req, tests, res);
			const labInstance = new Lab(href);
			labInstance.save((err) => {
				if (err) {
				  req.flash('errors', { msg: 'Your lab could not be submitted successfully. Please fill out correct information' });
				  res.redirect('addlab');
				} else {
				  req.flash('success', { msg: 'Lab was updated successfully' });
				  res.redirect('addlab');
				}
			});
		})
	}
}

function assignLabAttributes(req, tests) {
	const testnames = req.body.test;
	const costps = req.body.costp;
	const sellps = req.body.sellp;
	if(testnames.length != costps.length && testnames.length != sellps.length) {
		req.flash('errors', { msg: 'Invalid data for testnames, costps and sellps' });
		res.redirect('add');
	}

	var reqTestsHref = {};
	for(var i=0; i < testnames.length; i++ ){
		const testname = testnames[i];
		const costp = costps[i];
		const sellp = sellps[i];
		if(testname && costp && sellp) {
			reqTestsHref[testname] = [testname, costp, sellp];
		}

	}

	var href = {
		name: req.body.name,
		address: req.body.address,
		nearby: req.body.nearby,
		city: req.body.city,
		phone: req.body.phone,
		email: req.body.email,
		type: req.body.type,
		registration: req.body.registration,
		isactive: req.body.isactive,
		tests: [],
	}

	for(var i=0; i < tests.length; i++) {
		var testHref = tests[i];
		var test_name = testHref.name;
		if(test_name in reqTestsHref) {
			const localHerf = {
				_id: testHref._id,
				name: testHref.name,
				specimen: testHref.type,
				cprice: parseInt(reqTestsHref[test_name][1]),
				sprice: parseInt(reqTestsHref[test_name][2]),
			};

			href.tests.push(localHerf);
		}
	}

	return href;
}