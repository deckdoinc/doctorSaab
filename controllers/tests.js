const Test = require('../models/Test');
const Dropdown = require('../helpers/dropdown.json');


exports.getAdminTests = (req, res) => {
	Test.find({}, (err, result) => {
		if (err) throw err;
		res.render('tests/admin/tests', { tests: result});
	});
}

exports.getAddUpdate = (req, res) => {
	if(req.params.id) {
		Test.findById(req.params.id, (err, test) => {
			if(err) throw err;
			let testAttr = Dropdown;
			testAttr['_id'] = test._id;
			testAttr['name'] = test.name;
			testAttr['type'] = test.type;
			testAttr['specimen'] = test.specimen;
			testAttr['minageselect'] = test.minage;
			testAttr['maxageselect'] = test.maxage;
			testAttr['genderselect'] = test.gender;
			testAttr['isactiveselect'] = test.isactive;
			res.render('tests/admin/update', {testAttr : testAttr});
		});
	} else {
		res.render('tests/admin/add', { testAttr : Dropdown });
	}
}

exports.postAddUpdate = (req, res) => {
	if(req.minage > req.maxage) {
		req.flash('errors', { msg: 'Min age cannot be greater than max age' });
		res.redirect('addproduct');
	}

	if(req.params.id) {
		Test.findByIdAndUpdate(req.params.id, req.body, (err) => {
			if (err) {
			  req.flash('errors', { msg: 'Your test could not be submitted. Please fill out correct information' });
			  res.redirect(req.params.id);
			} else {
			  req.flash('success', { msg: 'Your test was submitted successfully' });
			  res.redirect(req.params.id);
			}			
		});
	} else {
		const test = new Test(req.body);
		test.save((err) =>  {
			if (err) {
			  req.flash('errors', { msg: 'Your test could not be submitted. Please fill out correct information' });
			  res.redirect('addtest');
			} else {
			  req.flash('success', { msg: 'Your test was submitted successfully' });
			  res.redirect('addtest');
			}
		});
	}
}

exports.deleteTest = (req, res) => {
	User.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
		  req.flash('errors', { msg: 'Your test could not be deleted. Contact your system administrator' });
		  res.redirect('/admin/tests');
		} else {
		  req.flash('success', { msg: 'Your test was successfully deleted' });
		  res.redirect('/admin/tests');
		}		
	});
}

exports.getSearchTestList = (req, res) => {
	var regex = new RegExp(req.query["term"], 'i');
	console.log(regex);
	var tests = Test.find({name: regex},{'name': 1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(30);
	tests.exec(function(err, data) {
		var result = [];
		if(!err) {
			if(data && data.length && data.length > 0) {
				data.forEach( test => {
					let obj = {
						id:test._id,
						name: test.name
					};
					result.push(obj);
				});
			}

			res.jsonp()
		}


	})

}
