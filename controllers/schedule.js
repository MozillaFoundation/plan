/**
 * Schedule route handlers
 *
 * @package build
 * @author  Andrew Sliwinski <a@mozillafoundation.org>
 */

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
    res.render('now', {
        title: 'This Sprint'
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
    res.render('next', {
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
    res.render('next', {
        title: 'Upcoming'
    });
};
