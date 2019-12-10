/**
 * Index Server Controller
 * Handles logic for all routes matching "/"
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const TowerClient = require('../lib/towerClient');

/**
 * Handles logic for "/".
 * Currently we are handling routing to your default route based
 * on what user type you are.
 * @param req - Express Request
 * @param res - Express Response
 */
exports.getIndex = (req, res) => {
  // Setup Tower Client
  let client = new TowerClient();

  // Configure clients auth token with user objects stored username:password token
  client.set_token(req.user.auth_token);

  // Fetch all job_template(s) the user logged in has access to
  client.get_job_templates().then(results => {
    // Render: / (root)
    res.render('Index', { 
      page_name: 'dashboard', 
      username: req.user.username,
      job_templates: results.results
    });
  }).catch(error => {
    res.send("There was error. Me stupid computer. (There really should be an error page here.. Check logs.)");
  });
};