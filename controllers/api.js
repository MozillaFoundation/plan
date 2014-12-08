var secrets = require('../config/secrets');
var githubconfig = require('../config/github');
var User = require('../models/User');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var request = require('request');
var Github = require('github-api');
var GitHubApi = require("github");
var github = new GitHubApi({
    // required
    version: "3.0.0",
    debug: true
});

var clientID = secrets.github.clientID;
var clientSecret = secrets.github.clientSecret;

github.authenticate({
    type: "oauth",
    key: clientID,
    secret: clientSecret
})

var Twit = require('twit');
var Y = require('yui/yql');
var _ = require('lodash');



exports.getIssues = function(req, res) {
  var url = "https://api.github.com/repos/" + githubconfig.github_org + '/' + githubconfig.github_repo + "/issues"
  url += "?client_id="+encodeURIComponent(clientID)+"&client_secret="+encodeURIComponent(clientID);
  url += "&labels="+encodeURIComponent(req.query.labels)
  var options = {
      url: url,
      headers: {
          'User-Agent': 'NodeJS HTTP Client'
      }
  };
  request.get(options, function(err, ret, body) {
    if (err) {
      console.log(err);
      res.status('500').json(err);
    } else {
      // console.log(body);
      res.status('200').json(body);
    }
  });
}



/**
 * GET /api
 * List of API examples.
 */

exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/github
 * GitHub API Example.
 */

exports.getGithub = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'github' });
  var github = new Github({ token: token.accessToken });
  var repo = github.getRepo('sahat', 'requirejs-library');
  repo.show(function(err, repo) {
    if (err) return next(err);
    res.render('api/github', {
      title: 'GitHub API',
      repo: repo
    });
  });

};
