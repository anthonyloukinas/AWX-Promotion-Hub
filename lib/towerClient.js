/**
 * lib/TowerClient.js
 */

/**
 * Module Requirements
 */

const request = require('request'),
  _ = require('lodash'),
  async = require('async');

/**
 * TowerClient Class
 * 
 * 
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 * @class
 */
class TowerClient {

  constructor() {
    this.host = "localhost"
    this.username = "admin"
    this.password = "password"
    this.protocol = "http"
    this.ROOT_URL = this.protocol + "://" + host + "/api/v2"
  }



}

module.exports = TowerClient;