var _ = require('lodash');
var querystring = require('querystring');
var validator = require('validator');
var request = require('request');

var secrets = require('../config/secrets');
var githubconfig = require('../config/github');

var clientID = secrets.github.clientID;
var clientSecret = secrets.github.clientSecret;

exports.getUser = function(req, res) {
  console.log('GETTING DATA FOR USER', req.query.username)
  var url = 'https://api.github.com/users/' + req.query.username
  var token;
  if (req.user && req.user.tokens && req.user.tokens[0].accessToken) {
    // if logged in, we'll skip any rate limiting by using the user's token
    token = req.user.tokens[0].accessToken;
  } else {
    // we'll use a token davidascher made to also avoid rate limiting
    token = secrets.github.token;
  }
  url += '?access_token=' + encodeURIComponent(token);
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
      if (ret.statusCode >= 400) {
        res.status(ret.statusCode).json(body);
      } else {
        res.status('200').json(body);
      }
    }
  });
}

exports.getIssues = function(req, res) {
  var url = 'https://api.github.com/repos/' + githubconfig.github_org +
    '/' + githubconfig.github_repo + '/issues' +
    '?client_id=' + encodeURIComponent(clientID) +
    '&client_secret=' + encodeURIComponent(clientID) +
    '&labels=' + encodeURIComponent(req.query.labels);

  var token;
  if (req.user && req.user.tokens && req.user.tokens[0].accessToken) {
    // if logged in, we'll skip any rate limiting by using the user's token
    token = req.user.tokens[0].accessToken;
  } else {
    // we'll use a token davidascher made to also avoid rate limiting
    token = secrets.github.token;
  }
  url += '&access_token=' + encodeURIComponent(token);
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
      if (ret.statusCode >= 400) {
        res.status(ret.statusCode).json(body);
      } else {
        res.status('200').json(body);
      }
    }
  });
}
