/**
 * lib/TowerClient.js
 */

/**
 * Module Requirements
 */

const request = require('request'),
  _ = require('lodash'),
  async = require('async'),
  config = require('../config/config');

/**
 * TowerClient Class
 * 
 * 
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 * @class
 */
class TowerClient {

  constructor() {
    this.host = config.tower.host;
    this.port = config.tower.port;
    this.protocol = config.tower.protocol;
    this.strict_ssl = config.tower.strict_ssl;
    this.auth_token = "";

    this._set_options();
  }

  login(username, password) {
    const authToken = "Basic " + new Buffer(username + ":" + password).toString("base64");
    return new Promise((resolve, reject) => {
      let opts = this.options({
        path: '/me/',
        method: 'GET',
        timeout: 1500,
        headers: {
          'Accept': 'application/json',
          'Authorization': authToken
        }
      });

      request(opts, function(err, res, body) {
        if (err) {
          reject(err);
        } else {
          if (res.statusCode === 401) {
            reject("Invalid username or password");
          } else if (res.statusCode === 200) {
            let data = JSON.parse(body);
            let user = data.results[0];
            user.auth_token = authToken;
            resolve(user);
          } else {
            reject(err);
          }
        }
      })
    });
  }

  check_tower_connectivity(protocol, host, port, strict_ssl, username, password) {
    return new Promise((resolve, reject) => {
      this.protocol = protocol;
      this.host = host;
      this.port = port;
      this.strict_ssl = strict_ssl;

      this._set_options();

      this.login(username, password).then(user => {
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    });
  }

  get_job_template(id) {
    return new Promise((resolve, reject) => {
      let opts = this.options({
        path: `/job_templates/${id}/`,
        method: 'GET',
        headers: {
          'Authorization': this.auth_token
        }
      });

      request(opts, function(err, res, body) { 
        if (err) reject(err);
        else {
          let job_template = JSON.parse(body);
          resolve(job_template);
        }
      });
    });
  }

  get_job_templates() {
    return new Promise((resolve, reject) => {
      let opts = this.options({
        path: '/job_templates/',
        method: 'GET',
        headers: {
          'Authorization': this.auth_token
        }
      });

      request(opts, function(err, res, body) { 
        if (err) reject(err);
        else {
          let job_templates = JSON.parse(body);
          resolve(job_templates);
        }
      });
    });
  }

  create_job_template() {
    return new Promise((resolve, reject) => {
      let opts = this.options({
        path: `/`
      })
    });
  }

  launch_job_template(job_template_id) {
    return new Promise((resolve, reject) => {
      let opts = this.options({
        path: `/job_templates/${job_template_id}/launch/`,
        method: "POST",
        headers: {
          'Authorization': this.auth_token
        }
      });
  
      request(opts, function(err, res) {
        if (res) {
          let parsedResponse = JSON.parse(res.body);
          resolve(parsedResponse);
        } else {
          reject(err);
        }
      });
    });
  }

  get_project(id) {
    return new Promise((resolve, reject) => {
      let opts = this.options({
        path: `/projects/${id}/`,
        method: 'GET',
        headers: {
          'Authorization': this.auth_token
        }
      });

      request(opts, function(err, res, body) {
        if (err) reject(err);
        else {
          let project = JSON.parse(body);
          resolve(project);
        }
      });
    });
  }

  set_token(token) {
    this.auth_token = token;
  }

  set_tower_instance(protocol, host, port, strict_ssl) {
    this.protocol = protocol;
    this.host = host;
    this.port = port;
    this.strict_ssl = strict_ssl;

    this._set_options();
  }

  _set_options() {
    this.ROOT_URL = this.protocol + "://" + this.host + ":" + this.port + "/api/v2";
    this.options = function(extra) {
      let options = {
        uri: `${this.ROOT_URL}${extra.path}`,
        strictSSL: this.strict_ssl,
      };

      console.log(options.uri);
      return _.extend(options, extra);
    }
  }

}

module.exports = TowerClient;