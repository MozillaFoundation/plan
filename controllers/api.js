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
  var token = secrets.github.token;
  url += "&access_token="+encodeURIComponent(token);

  // var token = _.find(req.user.tokens, { kind: 'github' });
  // if (req.user && req.user.tokens && req.user.tokens[0].accessToken) {
  //   // if logged in, we'll skip any rate limiting.
  //   var accessToken = req.user.tokens[0].accessToken;
  //   url += "?access_token="+encodeURIComponent(accessToken);
  // }
  var options = {
      url: url,
      headers: {
          'User-Agent': 'NodeJS HTTP Client'
      }
  };
  request.get(options, function(err, ret, body) {
    console.log(ret.statusCode);
    if (err) {
      console.log(err);
      res.status('500').json(err);
    } else {
      if (ret.statusCode >= 400) {
        res.status(ret.statusCode).json(body);
      } else {
        res.status('200').json(body);
      }
    }
  });
}

