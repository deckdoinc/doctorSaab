const Package = require('../models/Package');
const Tests = require('../models/Test');
const Dropdown = require('../helpers/dropdown');

exports.getAdminPackages = (req, res) => {
	Package.find({}, (err, packages) => {
		if(err) throw err;
		var outPackages = [];
		for(var i = 0; i < packages.length; i++) {
			var package = packages[i];
			var startdate = package.startdate;
			var enddate = package.enddate;
			outPackages.push({
				_id:  package._id,
				name: package.name,
				type: package.type,
				startdate: startdate ? startdate.toISOString().split("T")[0] : new Date(),
				enddate: startdate ? enddate.toISOString().split("T")[0] : new Date(),
				price: package.price,
				ttltests: package.tests.length,
			});
		}
		res.render("packages/admin/list", {packageAttr: outPackages.reverse()});
	})
}

exports.getAddUpdate = (req, res) => {
	if(req.params.id) {
		Package.findById(req.params.id, (err, package) => {
			if(err) throw err;
			package.genders = Dropdown.genders;
			package.citiesdd = Dropdown.citiesdd;
			package.packagetypes = Dropdown.packagetypes;
			package.ages = Dropdown.ages;
			res.render('packages/admin/update', {packageAttr: package});
		});
	} else {
		res.render('packages/admin/add', { packageAttr: Dropdown });
	}
}

exports.postAddUpdate = (req, res) => {
	var packageHref = {
		name: req.body.name,
		description: req.body.description,
		type: req.body.type,
		gender: req.body.gender,
		minage: req.body.minage,
		maxage: req.body.maxage,
		startdate: req.body.startdate,
		enddate: req.body.enddate,
		price: req.body.price,
		notes: req.body.notes,
		cities: req.body.city,
		tests:[],
	};

	var testNames = req.body.test;
	var testPrices = req.body.testp;
	for(var i=0; i < testNames.length; i++) {
		var testName = testNames[i];
		var testPrice = testPrices[i];
		if(!testName) { continue; }
		packageHref.tests.push({
			name: testName,
			price: testPrice 
		});
	}

	if(req.params.id) {
		Package.findByIdAndUpdate(req.params.id, packageHref, (err) => {
			if (err) {
			  req.flash('errors', { msg: 'Your package could not be updated. Try consulting system admin' });
			  res.redirect(req.params.id);
			} else {
			  req.flash('success', { msg: 'Your package was updated successfully' });
			  res.redirect(req.params.id);
			}			
		});
	} else {
		const package = new Package(packageHref);
		package.save((err) => {
			if (err) {
			  console.log(err);
			  req.flash('errors', { msg: 'Your package could not be submitted. Please fill out correct information' });
			  res.redirect('add');
			} else {
			  req.flash('success', { msg: 'Your package was submitted successfully' });
			  res.redirect('add');
			}
		}); 
	}
}

exports.getPackagePage = (req, res) => {
	res.render('packages/client/packages', {
		title: 'Packages',
	});
}