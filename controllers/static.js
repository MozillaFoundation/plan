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
exports.splash = function (req, res) {
  res.render('splash', {
    title: 'Let\'s Build Webmaker Together'
  });
};

/**
 * Redirect handlers
 */
exports.strategy = function (req, res) {
  res.redirect('http://wiki.mozilla.com/Webmaker/2015');
};

exports.product = function (req, res) {
  res.redirect('https://github.com/mozillafoundation/product');
};

exports.design = function (req, res) {
  res.redirect('https://github.com/mozillafoundation/design');
};

exports.engineering = function (req, res) {
  res.redirect('https://github.com/mozillafoundation/engineering');
};

exports.involved = function (req, res) {
  res.redirect('http://mozilla.org');
};
