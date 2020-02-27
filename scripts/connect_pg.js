/**
 * connect_pg.js
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 * @script
 */

/**
 * Module Requirements
 */
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'awx',
  host: 'localhost',
  database: 'awx',
  password: 'postgres',
  port: 5432,
});

exports.

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});