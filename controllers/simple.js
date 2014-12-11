/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

/**
 * GET /now (?label=jan15)
 * Now page.
 */
exports.now = function(req, res) {
  label = req.query.label;
  res.render('now', {
    title: 'Now',
    label: label
  });
};


/**
 * GET /next
 * Next page.
 */
exports.next = function(req, res) {
  res.render('next', {
    title: 'Next',
  });
};


/**
 * GET /who
 * Who page.
 */
exports.who = function(req, res) {
  res.render('who', {
    title: 'Who',
  });
};

/**
 * GET /design
 * Who page.
 */
exports.design = function(req, res) {
  res.render('design', {
    title: 'Design',
  });
};

/**
 * GET /who
 * Who page.
 */
exports.tools = function(req, res) {
  res.render('tools', {
    title: 'Tools',
  });
};
