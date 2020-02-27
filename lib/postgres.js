/**
 * Postgres Client Class
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 * @type {PG.Pool}
 * @returns {PG.Pool}
 */

/**
 * Module Requirements
 */
const { Pool } = require('pg');

/**
 * Postgres Pool
 * @type {PG.Pool}
 */
const pool = new Pool({
  user: 'awx',
  host: 'localhost',
  database: 'awx',
  password: 'postgres',
  port: 5432,
});

pool.on('error', (error, client) => {
  console.error('Unexpected error on idle client', error)
});

const query = function(text, params, callback) {
  const start = Date.now();
  pool.query(text, params, (err, res) => {
    if (err) callback(err);
    console.log(text, params);
    const duration = `${Date.now() - start}ms`;
    console.log("Postgres executed query\n", {
      text,
      duration,
      rows: res.rowCount
    });
    callback(null, res);
  });
}

/**
 * Exported pool
 * @type {PG.Pool}
 */
module.exports = {
  pool,
  query,
  queryAsync: (text, params) => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      query(text, params, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  },
};