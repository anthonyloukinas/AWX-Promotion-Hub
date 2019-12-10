/**
 * Index Server Routes
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const Index = require('../controllers/index.server.controller'),
    authUtil = require('../lib/utilities/authentication');

/**
 * Route Handling logic
 * @param app - Express Application
 */
module.exports = function(app){

    app.route('/')
        .get(authUtil.isLoggedIn, Index.getIndex);

};