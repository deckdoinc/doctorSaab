const Clients = require('../models/Client');

exports.getClients = (req, res) => {
	res.render('clients/clients', {
		title: 'Clients List',
	});
}
