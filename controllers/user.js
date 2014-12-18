/**
 * GET /login
 * Login page.
 */
exports.getLogin = function (req, res) {
  if (req.session.token) return res.redirect('/');

  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function (req, res) {
  req.session.token = null;
  res.redirect('/');
};
