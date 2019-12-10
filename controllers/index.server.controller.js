/**
 * Index Server Controller
 * Handles logic for all routes matching "/"
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Handles logic for "/".
 * Currently we are handling routing to your default route based
 * on what user type you are.
 * @param req - Express Request
 * @param res - Express Response
 */
exports.getIndex = (req, res) => {
  res.render('Index', { page_name: 'dashboard'});
};