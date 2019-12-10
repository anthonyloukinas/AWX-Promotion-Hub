/**
 * Auth Server Controller
 * Handles logic for all routes matching "/auth"
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

const request = require('request');

/**
 * Handles logic for "/auth/login".
 * Currently we are handling routing to your default route based
 * on what user type you are.
 * @param req - Express Request
 * @param res - Express Response
 */
exports.getLogin = (req, res) => {
    res.render('Login', { page_name: 'auth/login'});
};

exports.postLogin = (req, res) => {
    console.log(req.body);
    res.send('we logged in!');
};

exports.getLogout = (req, res) => {
    req.logout();
    res.redirect('/auth/login');
};