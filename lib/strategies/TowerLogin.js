/**
 * Tower Login Strategy
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module Dependencies
 */
const LocalStrategy = require('passport-local').Strategy,
  request = require('request'),
  TowerClient = require('../towerClient'),
  config = require('../../config/config');

/**
 * Tower Login Strategy Logic
 */
const towerLogin = new LocalStrategy({
  usernameField: 'towerUsername',
  passwordField: 'towerPassword',
  passReqToCallback: true
}, function(req, email, password, done) {
  process.nextTick(function() { 
    // Setup Tower Client
    let client = new TowerClient();

    // Login client using username and password from html form
    client.login(req.body.towerUsername, req.body.towerPassword).then(user => {
      // User logged in successfully
      done(null, user);
    }).catch(err => {
      // User was unable to login
      done(err);
    });
  });
});

module.exports = towerLogin;