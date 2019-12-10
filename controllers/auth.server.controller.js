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

  const options = {
      url: 'http://' + req.body.towerUsername + ':' + req.body.towerPassword + '@localhost:8080/api/v2/me/',
      method: 'GET',
      headers: {
          'Accept': 'application/json'
      }
  };

  request(options, function(err, res, body) {
     let json = JSON.parse(body);
     console.log(json);
  });

  const authToken = "Basic " + new Buffer(req.body.towerUsername + ":" + req.body.towerPassword).toString("base64");

  request(
      {
          url: 'http://localhost:8080/api/v2/me',
          headers: {
              "Authorization": authToken
          }
      },
      function (error, response, body) {
          console.log(JSON.parse(body));
      }
  )
};