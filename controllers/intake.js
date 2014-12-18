var request = require('request');
var _ = require('lodash');

var githubconfig = require('../config/github');
var secrets = require('../config/secrets');

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

var checklist = '\n\n' +
  ' - [ ] Kickoff meeting scheduled.\n' +
  ' - [ ] Deadline and flexibility established.\n' +
  ' - [ ] Localization plan created.\n' +
  ' - [ ] Milestones created.\n' +
  ' - [ ] Maintenance plan created.\n' +
  ' - [ ] Analytices plan created.\n' +
  ' - [x] Scope creep avoided.\n';

var raci = '\n\n' +
  '* Phase: \n' +
  '* Owner: \n' +
  '* Decision Maker: \n' +
  '* Design Lead: \n' +
  '* Development Lead: \n' +
  '* Quality Verifier: \n';

exports.postIntake = function (req, res) {

  req.assert('audience', 'You have to specify an audience.').notEmpty();
  req.assert('problem', 'We can\'t solve a problem we don\'t understand.').notEmpty();
  req.assert('success', 'We need to understand what you\'re trying to accomplish.').notEmpty();
  req.assert('vision', 'You must enlighten us with your vision for a solution.').notEmpty();
  req.assert('mvp', 'Think simply: how do I write an MVP?').notEmpty();
  req.assert('risks', 'You risk losing your work by not telling us where the hidden problems are.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/intake');
  }

  var audience = req.body.audience;
  var problem = req.body.problem;
  var success = req.body.success;
  var vision = req.body.vision;
  var mvp = req.body.mvp;
  var risks = req.body.risks;
  var name = res.locals.user.login;

  var body = '' +
    '## Problem\n' + problem + '\n\n' +
    '### Audience\n' + audience + '\n\n' +
    '### Success\n' + success + '\n\n' +
    '### Vision\n' + vision + '\n\n' +
    '#### MVP\n' + mvp + '\n\n' +
    '### Risks\n' + risks + '\n\n' +
    '## Preparation Checklist\n' + checklist + '\n\n' +
    '## RACI\n' + raci;

  var url = "https://api.github.com/repos/" + githubconfig.github_org + '/' + githubconfig.github_repo + "/issues";
  url += "?access_token=" + encodeURIComponent(req.session.token);

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

  request.post(options, function (err, ret, body) {
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
