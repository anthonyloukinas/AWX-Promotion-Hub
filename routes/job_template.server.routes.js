/**
 * Job Templates Server Routes
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const JobTemplate = require('../controllers/job_template.server.controller'),
    authUtil = require('../lib/utilities/authentication');

/**
 * Route Handling logic
 * @param app - Express Application
 */
module.exports = function(app){

    app.route('/job_template/:job_template_id/promote')
        .get(authUtil.isLoggedIn, JobTemplate.getPromote);

    app.route('/job_template/:job_template_id')
        .get(authUtil.isLoggedIn, JobTemplate.getJobTemplate);

};