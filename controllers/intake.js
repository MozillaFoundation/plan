var githubconfig = require('../config/github');
var request = require('request');
var _ = require('lodash');


/**
 * GET /contact
 * Contact form page.
 */

exports.getIntake = function(req, res) {
  res.render('intake', {
    title: 'New Project Intake'
  });
};

/**
 * POST /intake
 * create an issue in the right repo
 * @param email
 * @param name
 * @param message
 */

var template = '\n\ - [ ] Consultation Meeting Scheduled: …\n'+
' - [ ] Understand big-picture objective of the request: …\n'+
' - [ ] Agree on context: …\n'+
' - [ ] Find out Deadline: …\n'+
' - [ ] Is deadline firm or flexible: …\n'+
' - [ ] Establish RACI: …\n'+
' - [ ] What resources exist: …\n'+
' - [ ] What is the audience: …\n'+
' - [ ] Suss out likelihood of scope creep: …\n'+
' - [ ] Determine MVP scope: …\n'+
' - [ ] What domain should be used: …\n'+
' - [ ] Will it be hosted on mozilla.org: …\n'+
' - [ ] Find out how long it need to be maintained: …\n'+
' - [ ] Agree on who will do maintenance: …\n'+
' - [ ] Determine localization needs : …\n'+
' - [ ] Establish Milestones: …\n'+
' - [ ] Understand if analytics required: …\n'+
' - [ ] Determine what degree of quality is required: …\n'

exports.postIntake = function(req, res) {

  req.assert('audience', 'You have to specify an audience').notEmpty();
  req.assert('problem', 'We can solve a problem we don\'t undderstand').notEmpty();
  req.assert('accomplish', 'We need to understand what you\'re trying to accomplish').notEmpty();
  
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/intake');
  }

  var audience = req.body.audience;
  var problem = req.body.problem;
  var accomplish = req.body.accomplish;
  var ideas = req.body.ideas;
  var name = req.user.profile.name;

  body = accomplish + '\n\nAudience: ' + audience + '\nI suggest: ' + ideas + template;
  var url = "https://api.github.com/repos/" + githubconfig.github_org + '/' + githubconfig.github_repo + "/issues"
  var token = secrets.github.token;
  url += "?access_token="+encodeURIComponent(token);
  // if (req.user && req.user.tokens && req.user.tokens[0].accessToken) {
  //   // if logged in, we'll skip any rate limiting.
  //   var accessToken = req.user.tokens[0].accessToken;
  //   url += "?access_token="+encodeURIComponent(accessToken);
  // }
  var options = {
      url: url,
      headers: {
          'User-Agent': 'NodeJS HTTP Client'
      },
      body: JSON.stringify({
        title: problem,
        body: body
      }),
  };
  request.post(options, function(err, ret, body) {
    if (err) {
      req.flash('errors', err);
      return res.redirect('/intake');
    } else {
      if (ret.statusCode >= 400) {
        req.flash('errors', {'msg': JSON.parse(body).message});
        return res.redirect('/');
      }
      return res.redirect(JSON.parse(body).html_url);
    }
  });
  return;
};
