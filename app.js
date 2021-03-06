/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');
const clientController = require('./controllers/clients');
const packageController = require('./controllers/packages');
const testController = require('./controllers/tests');
const labController = require('./controllers/labs');
const patientController = require('./controllers/patients');
const peopleController = require('./controllers/peoples');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload' || req.path === '/admin/addlab') {
    // Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user
    && req.path !== '/login'
    && req.path !== '/signup'
    && !req.path.match(/^\/auth/)
    && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user
    && (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/chart.js/dist'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account/verify', passportConfig.isAuthenticated, userController.getVerifyEmail);
app.get('/account/verify/:token', passportConfig.isAuthenticated, userController.getVerifyEmailToken);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/upload', lusca({ csrf: true }), apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), lusca({ csrf: true }), apiController.postFileUpload);
app.get('/api/chart', apiController.getChart);





/** Company APIs Start here **/
app.get('/admin/searchtext/', passportConfig.isAuthenticated, testController.getSearchTestList);
app.get('/admin/updatelab/searchtext', passportConfig.isAuthenticated, testController.getSearchTestList);  
app.get('/admin/tests', passportConfig.isAuthenticated, testController.getAdminTests);
app.get('/admin/addtest', passportConfig.isAuthenticated, testController.getAddUpdate);
app.post('/admin/addtest', passportConfig.isAuthenticated, testController.postAddUpdate);
app.get('/admin/updatetest/:id', passportConfig.isAuthenticated, testController.getAddUpdate);
app.post('/admin/updatetest/:id', passportConfig.isAuthenticated, testController.postAddUpdate);
app.get('/admin/labs', passportConfig.isAuthenticated, labController.getAdminLabs);
app.get('/admin/addlab', passportConfig.isAuthenticated, labController.getAddUpdate);
app.post('/admin/addlab', passportConfig.isAuthenticated, labController.postAddUpdate);
app.get('/admin/updatelab/:id', passportConfig.isAuthenticated, labController.getAddUpdate);
app.post('/admin/updatelab/:id', passportConfig.isAuthenticated, labController.postAddUpdate);

app.get('/admin/packages', passportConfig.isAuthenticated, packageController.getAdminPackages);
app.get('/client/packages', packageController.getPackagePage);
app.get('/admin/addpackage', passportConfig.isAuthenticated, packageController.getAddPackage);

app.get('/requestquote', clientController.requestQuote);
app.post('/patientdetail', clientController.getPatientDetail);
app.post('/submitquote', clientController.postSubmitQuote);
app.get('/admin/clients', passportConfig.isAuthenticated, clientController.getClientList);
app.get('/admin/updateclient/:id', passportConfig.isAuthenticated, clientController.getClientDetail);


app.post('/admin/patient/create', passportConfig.isAuthenticated, patientController.postCreatePatient);
app.get('/admin/patient/create', passportConfig.isAuthenticated, patientController.getCreatePatient);
app.get('/admin/patient/add', passportConfig.isAuthenticated, patientController.getAddPatient);
app.post('/admin/patient/add', passportConfig.isAuthenticated, patientController.postAddPatient);
app.get('/admin/patient/update/:id', passportConfig.isAuthenticated, patientController.getUpdatePatient);
app.post('/admin/patient/update/:id', passportConfig.isAuthenticated, patientController.postUpdatePatient);
app.get('/admin/patients', passportConfig.isAuthenticated, patientController.getPatientList);

//Peoples
app.get('/admin/people/add', passportConfig.isAuthenticated, peopleController.getAddPeople);
app.post('/admin/people/add', passportConfig.isAuthenticated, peopleController.postAddPeople);
app.get('/admin/peoples', passportConfig.isAuthenticated, peopleController.getPeopleList);

//Emails
app.get('/quote-email', homeController.getTestEmail)
/** Company APIs End here


/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
