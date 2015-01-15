/**
 * Github API helper methods.
 *
 * @package  build
 * @author   Andrew Sliwinski <a@mozillafoundation.org>
 */

var lru = require('lru-cache');
var request = require('request');
var secrets = require('../config/secrets');

/**
 * Constructor
 */
function Github(client, secret) {
  var _this = this;

  _this.client = client;
  _this.secret = secret;
  _this.host = 'https://api.github.com';
  _this.repo = '/repos/mozillafoundation/plan';
  _this.cache = lru({
    max: 100,
    maxAge: 1000 * 60 * 60
  });

  /**
   * Express middleware adapter. Attaches user information to the request if an
   * auth token exists within the session object.
   *
   * @param  {object}   req  Request
   * @param  {object}   res  Response
   * @param  {Function} next Callback
   */
  _this.middleware = function(req, res, next) {
    // If no token exists in the session, continue
    if (!req.session.token) {
      res.locals.user = null;
      return next();
    }

    // If token exists, fetch user from Github API & continue
    _this.getUserFromToken(req.session.token, function(err, user) {
      // Handle error state(s)
      if (err) {
        req.session.token = null;
        res.locals.user = null;
        return next();
      }

      // Attach user object to res.locals for template rendering
      res.locals.user = user;
      next();
    });
  };
}

/**
 * Returns a user object from the Github API based on the provided auth token.
 *
 * @param  {string}   token    OAuth token provided by Github
 * @param  {Function} callback
 */
Github.prototype.getUserFromToken = function(token, callback) {
  var _this = this;

  request({
    method: 'GET',
    uri: _this.host + '/user',
    headers: {
      'User-Agent': 'build.webmaker.org',
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token ' + token
    },
    json: {}
  }, function(err, res, body) {
    callback(err, body);
  });
};

/**
 * Returns an array of milestones from the "plan" repo.
 *
 * @param  {string}   token    OAuth token provided by Github
 * @param  {Function} callback
 */
Github.prototype.getMilestones = function(callback) {
  var _this = this;

  // Cache target
  var url = _this.host + _this.repo + '/milestones';
  var copy = _this.cache.get(url);
  if (typeof copy !== 'undefined') {
    return callback(null, copy);
  }

  // Request from API
  request({
    method: 'GET',
    uri: url,
    headers: {
      'User-Agent': 'build.webmaker.org',
      Accept: 'application/vnd.github.v3+json'
    },
    json: {}
  }, function(err, res, body) {
    if (err) return callback(err);

    // Set cache & return
    _this.cache.set(url, body);
    callback(err, body);
  });
};

Github.prototype.getIssuesForMilestone = function(id, callback) {
  var _this = this;

  // Cache target
  var url = _this.host + _this.repo + '/issues';
  var copy = _this.cache.get(url);
  if (typeof copy !== 'undefined') {
    return callback(null, copy);
  }

  // Request from API
  request({
    method: 'GET',
    uri: url,
    headers: {
      'User-Agent': 'build.webmaker.org',
      Accept: 'application/vnd.github.v3+json'
    },
    qs: {
      milestone: id,
      state: 'open'
    },
    json: {}
  }, function(err, res, body) {
    if (err) return callback(err);

    // Set cache & return
    _this.cache.set(url, body);
    callback(err, body);
  });
};

Github.prototype.thisMilestone = function(callback) {
  var _this = this;

  _this.getMilestones(function (err, milestones) {
    if (err) return callback(err);
    _this.getIssuesForMilestone(milestones[0].number, callback);
  });
};

Github.prototype.nextMilestone = function(callback) {
  var _this = this;

  _this.getMilestones(function (err, milestones) {
    if (err) return callback(err);
    _this.getIssuesForMilestone(milestones[1].number, callback);
  });
};

/**
 * Export
 */
module.exports = Github;
