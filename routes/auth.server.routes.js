/**
 * Index Server Routes
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const Auth = require('../controllers/auth.server.controller');

/**
 * Route Handling logic
 * @param app - Express Application
 */
module.exports = function(app){

    app.route('/auth/login')
        .get(Auth.getLogin)
        .post(Auth.postLogin);

};