/**
 * Static route handlers
 *
 * @package build
 * @author  Andrew Sliwinski <a@mozillafoundation.org>
 */

/**
 * Splash page route handler.
 *
 * @param  {object} req Request
 * @param  {object} res Response
 *
 * @return {void}
 */
exports.splash = function(req, res) {
  res.render('splash', {
    title: 'Let\'s Build Webmaker Together',
    hideTitle: true
  });
};

/**
 * Redirect handlers
 */
exports.strategy = function(req, res) {
  res.redirect('https://wiki.mozilla.org/Webmaker/2015');
};

exports.dashboard = function(req, res) {
  res.redirect('https://mozillafoundation.geckoboard.com/dashboards/F62088172D822E2A');
};

exports.product = function(req, res) {
  res.redirect('https://github.com/MozillaFoundation/plan/issues/187');
};

exports.design = function(req, res) {
  res.redirect('https://github.com/MozillaFoundation/Mofo-Design-Handbook');
};

exports.engineering = function(req, res) {
  res.redirect('https://github.com/MozillaFoundation/MoFo-Engineering-Handbook');
};

exports.involved = function(req, res) {
  res.redirect('https://webmaker.org/en-US/getinvolved');
};
