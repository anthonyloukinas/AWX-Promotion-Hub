/**
 * Passport Middleware
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module Dependencies
 */
const passport = require('passport');

/**
 * Passport Configuration
 */
const TowerLogin = require('./strategies/TowerLogin');

/**
 * Passport Init
 */
passport.use('local-login', TowerLogin);

/**
 * Passport Serialization
 */
passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

/**
 * Passport Deserialization
 */
passport.deserializeUser(function(user, done) { 
  done(null, user);
});