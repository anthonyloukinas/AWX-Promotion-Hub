/**
 * MySQL Client Class
 * This creates a MySQL connection pool, and returns it.
 *
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 * @type {Pool}
 * @returns {pool}
 */

/**
 * Module dependencies
 */
const mysql         = require('mysql'),
      config        = require('../config/config');

/**
 * Configuration variables
 */
const { connectionLimit, host, user, password, database } = config.sql;

/**
 * MySQL Pool
 */
const pool = mysql.createPool({
    connectionLimit,
    host,
    user,
    password,
    database
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('connection', function (connection) {
    connection.query('SET SESSION auto_increment_increment=1')
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

/**
 * Exported Pool
 */
module.exports = pool;