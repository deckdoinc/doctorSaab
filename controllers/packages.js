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

exports.getPackagePage = (req, res) => {
	res.render('packages/client/packages', {
		title: 'Packages',
	});
}