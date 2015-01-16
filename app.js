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
var flash = require('express-flash');
var hbs = require('hbs');
var path = require('path');
var expressValidator = require('express-validator');

/**
 * Import API keys from environment
 */
var secrets = require('./config/secrets');

/**
 * Github handlers
 */
var Github = require('./models/github');
var github = new Github(
  secrets.github.clientID,
  secrets.github.clientSecret
);

var oauth = require('github-oauth')({
  githubClient: secrets.github.clientID,
  githubSecret: secrets.github.clientSecret,
  baseURL: secrets.github.host,
  callbackURI: secrets.github.callbackURL,
  loginURI: '/login',
  scope: 'user,repo,public_repo'
});

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
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(sessions({
  cookieName: 'session',
  secret: secrets.sessionSecret,
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
}));
app.use(compress());
app.use(express.static(
  path.join(__dirname, 'public'), { maxAge: 1000 * 3600 * 24 * 365.25 })
);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(flash());
app.use(github.middleware);

/**
 * Controllers (route handlers).
 */
var routes = {
  static: require('./controllers/static'),
  schedule: require('./controllers/schedule')
};

/**
 * Main routes.
 */
app.get('/', routes.static.splash);

app.get('/add', routes.schedule.add);
app.get('/now', routes.schedule.now);
app.get('/next', routes.schedule.next);
app.get('/upcoming', routes.schedule.upcoming);

app.get('/strategy', routes.static.strategy);
app.get('/dashboard', routes.static.dashboard);

app.get('/product', routes.static.product);
app.get('/design', routes.static.design);
app.get('/engineering', routes.static.engineering);
app.get('/involved', routes.static.involved);

app.post('/add', routes.schedule.post);
app.get('/auth/github', oauth.login);
app.get('/auth/github/callback', function (req, res) {
  oauth.callback(req, res, function (err, body) {
    if (err) {
      req.flash('errors', {msg: err});
    } else {
      req.session.token = body.access_token;
    }

    res.redirect('/add');
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
