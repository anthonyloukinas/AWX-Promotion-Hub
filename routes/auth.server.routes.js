/**
 * Index Server Routes
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const passport = require('passport'),
    passportService = require('../lib/passport'),
    Auth = require('../controllers/auth.server.controller');

/**
 * Use Passport Authentication Strategies
 * @type {AuthenticateRet}
 */
const requireLogin = passport.authenticate(
    ['local-login'], {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        passReqToCallback: true
    }
);

/**
 * Route Handling logic
 * @param app - Express Application
 */
module.exports = function(app){

    app.route('/auth/login')
        .get(Auth.getLogin)
        .post(requireLogin, Auth.postLogin);

    app.route('/auth/logout')
        .get(Auth.getLogout);

};