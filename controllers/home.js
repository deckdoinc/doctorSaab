const utils = require('../emails/utils');
const Email = require('email-templates');
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

// GET /test-email
exports.getTestEmail = (req, res) => {
  const subject = "Quote Request : We will be in touch - DoctorSaab";
  const receiver = "luitelasti1995@gmail.com";
  const emailBody = new Email();
  const locals = { name: 'Mr Doctor Saab' }

  emailBody
    .render('../emails/quote-email.pug', locals)
    .then((html) => {
      utils.sendCustomEmail(subject, receiver, html);
    })
    .catch(console.error);

  res.render('../emails/quote-email', { title: 'Just testing email' });
};