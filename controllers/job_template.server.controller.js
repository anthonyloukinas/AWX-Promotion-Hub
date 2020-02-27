/**
 * Index Server Controller
 * Handles logic for all routes matching "/"
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const TowerClient = require('../lib/towerClient');
const crypt = require('../lib/utilities/crypt');
const database = require('../lib/postgres');


/**
 * Handles logic for "/job_templates/:job_template_id"
 * @param req - Express Request
 * @param res - Express Response
 */
exports.getJobTemplate = (req, res) => {
  let job_template_id = req.params.job_template_id;

  // Setup Tower Client
  let client = new TowerClient();

  // Configure clients auth token with user objects stored username:password token
  client.set_token(req.user.auth_token);

  client.get_job_template(job_template_id).then(results => {
    let creds = [];
    results.summary_fields.credentials.forEach(credential => {
      const { id } = credential;

      database.queryAsync("SELECT id, name, inputs FROM main_credential WHERE id = $1", [id]).then(credential_row => {
        let pk_id = credential_row.rows[0].id;
        let secret_key = 'aabbcc';
        let inputs = credential_row.rows[0].inputs;

        crypt.decryptCredential(secret_key, inputs, pk_id, (error, cred) => {
          if (error) throw error;
          creds.push(cred);
        });
      }).catch(e => {
        console.error(e);
      });
    });

    client.get_project(results.project).then(project => {
      res.render('Job_Template', {
        page_name: 'job_template',
        username: req.user.username,
        job_template: results,
        project: project,
        creds: creds
      });
    });
  }).catch(() => {
    res.send("There was error. Me stupid computer. (There really should be an error page here.. Check logs.)");
  });
};

/**
 * Handles logic for "/job_templates/:job_template_id/promote"
 * @param req - Express Request
 * @param res - Express Response
 */
exports.getPromote = (req, res) => {
  let job_template_id = req.params.job_template_id;
  res.send("Promoted " + job_template_id);
};