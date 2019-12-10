/**
 * Admin Server Routes
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const Admin = require('../controllers/admin.server.controller'),
    authUtil = require('../lib/utilities/authentication');

/**
 * Route Handling logic
 * @param app - Express Application
 */
module.exports = function(app){

    app.route('/admin/settings')
        .get(authUtil.isLoggedIn, authUtil.isSuperUser, Admin.getSettings);

    app.route('/admin/settings/tower_clusters')
        .get(authUtil.isLoggedIn, authUtil.isSuperUser, Admin.getTowerClusters);

    app.route('/admin/settings/tower_clusters/:id')
        .get(authUtil.isLoggedIn, authUtil.isSuperUser, Admin.getTowerCluster)
        .post(authUtil.isLoggedIn, authUtil.isSuperUser, Admin.postTowerCluster);

    app.route('/admin/settings/tower_clusters/:id/check_in')
        .get(authUtil.isLoggedIn, authUtil.isSuperUser, Admin.getTowerClustersCheckIn);

    app.route('/admin/check_tower_connectivity/:id')
        .get(authUtil.isLoggedIn, authUtil.isSuperUser, Admin.getCheckTowerConnectivity);

};