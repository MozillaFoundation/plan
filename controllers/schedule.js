/**
 * Schedule route handlers
 *
 * @package build
 * @author  Andrew Sliwinski <a@mozillafoundation.org>
 */

var secrets = require('../config/secrets');
var Github = require('../models/github');
var github = new Github(
  secrets.github.clientID,
  secrets.github.clientSecret
);

/**
 * "Add Project" route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.add = function (req, res) {
  res.render('add', {
    title: 'Add Project'
  });
};

/**
 * "This Sprint" route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.now = function (req, res) {
  github.thisMilestone(function (err, body) {
    if (err) res.redirect('/500');

    console.dir(body[0].labels);

    res.render('sprint', {
        title: 'This Sprint',
        issues: body
    });    
  });
};

/**
 * "Next Sprint" route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.next = function (req, res) {
    res.render('sprint', {
        title: 'Next Sprint'
    });
};

/**
 * "Upcoming" route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.upcoming = function (req, res) {
    res.render('calendar', {
        title: 'Upcoming'
    });
};
