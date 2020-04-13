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
		Lab.findById((req.params.id), (err, labs) => {
			var labAttr = Object.assign({}, DropDown, labs._doc);
			console.log(labAttr);
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
   
	} else {
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

		Test.find({isactive: 'active'}, (err, tests) => {
			if(err) throw err;
			const labInstance = new Lab({
				name: req.body.name,
				address: req.body.address,
				nearby: req.body.nearby,
				city: req.body.city,
				phone: req.body.phone,
				email: req.body.email,
				labtype: req.body.labtype,
				registration: req.body.registration,
				active: req.body.isactive,
				tests: [],
			});

			for(var i=0; i < tests.length; i++) {
				var href = tests[i];
				var test_name = href.name;
				if(test_name in reqTestsHref) {
					console.log(href._id);
					const localHerf = {
						_id: href._id,
						name: href.name,
						specimen: href.type,
						cprice: parseInt(reqTestsHref[test_name][1]),
						sprice: parseInt(reqTestsHref[test_name][2]),
					};

					labInstance.tests.push(localHerf);
				}
			}

			labInstance.save((err) => {
				if (err) {
				  console.log(err);
				  req.flash('errors', { msg: 'Your test could not be submitted. Please fill out correct information' });
				  res.redirect('add');
				} else {
				  req.flash('success', { msg: 'Your test was submitted successfully' });
				  res.redirect('add');
				}
			});
		})
	}
}

