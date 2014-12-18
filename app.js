/**
 * HTTP server for build.webmaker.org
 *
 * @package build
 * @author  David Ascher <davida@mozillafoundation.org>
 *          Andrew Sliwinski <a@mozillafoundation.org>
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');

var sessions = require('client-sessions');
var lusca = require('lusca');
var flash = require('express-flash');
var path = require('path');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */
var simpleController = require('./controllers/simple');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var intakeController = require('./controllers/intake');

/**
 * Import API keys from environment
 */
var secrets = require('./config/secrets');

/**
 * Create Express server.
 */
var app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('github_org', 'MozillaFoundation');
app.set('github_repo', 'plan');
app.set('view engine', 'jade');

app.use(sessions({
  cookieName: 'session',
  secret: secrets.sessionSecret,
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}));
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(lusca.csrf());
app.use(cookieParser());
app.use(flash());

/**
 * OAuth handler
 */
var oauth = require('github-oauth')({
  githubClient: secrets.github.clientID,
  githubSecret: secrets.github.clientSecret,
  baseURL: 'http://localhost:3000',
  loginURI: '/login',
  callbackURI: secrets.github.callbackURL,
  scope: 'user,repo,public_repo'
});

/**
 * CORS
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;
  next();
});

// app.use(function(req, res, next) {
//   // Remember original destination before login.
//   var path = req.path.split('/')[1];
//   // this next bit is totally weird, needs documentation
//   if (/auth|login|logout|signup|fonts|smalllogo.png|api|now|next|design|tools|mentions|favicon/i.test(path)) {
//     return next();
//   }
//   req.session.returnTo = req.path;
//   next();
// });

/**
 * Main routes.
 */
app.get('/', simpleController.index);
app.get('/now', simpleController.now);
app.get('/next', simpleController.next);
app.get('/who', simpleController.who);
app.get('/design', simpleController.design);
app.get('/tools', simpleController.tools);
app.get('/mentions', simpleController.mentions);

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);

// app.get('/intake', passportConf.isAuthenticated, intakeController.getIntake);
// app.post('/intake', intakeController.postIntake);
// app.get('/account', passportConf.isAuthenticated, userController.getAccount);

// app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);

app.get('/api/issues', apiController.getIssues)
app.get('/api/user', apiController.getUser)

app.get('/auth/github', oauth.login);
app.get('/auth/github/callback', function (req, res) {
  oauth.callback(req, res, function (err, body) {
    if (err) {
      req.flash('errors', {msg: err});
    } else {
      req.session.token = body.access_token;
    }

    res.redirect('/');
  });
});

/**
 * 500 Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
