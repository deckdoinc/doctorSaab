const Packages = require('../models/Package');
const Tests = require('../models/Test')

exports.getAdminPackages = (req, res) => {
	res.render('packages/admin/packages', {
		title: 'Packages List',
	});
}

exports.getAddPackage = (req, res) => {
	res.render('packages/admin/addpackage', {
		title: 'Add Package',
	});
}

exports.getPackage = (req, res) => {
	res.render('package', {
		title: 'packages',
	});
}