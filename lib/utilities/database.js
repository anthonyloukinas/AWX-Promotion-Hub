/**
 * Database Utility Functions
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const connection = require('../mysql'),
  TowerClient = require('../towerClient');

/**
 * Query middleman with error handling
 * @param {string} query - MySQL compliant query string
 * @param {array} vars - MySQL Variables in order of string
 * @param callback
 * @returns results
 */
const query = (query, vars, callback) => {
  if(connection){
      connection.getConnection((err, conn) => {
        if(err) callback(err, null);
        else {
            conn.query(query, vars, (error, results) => {
                if(error) callback(error, null);
                else callback(null, results);
            });
            conn.release();
        }
      });
  } else {
      console.error(chalk.red('Unable to load MySQL Connector, please check that the library was imported correctly.'));
      callback(new Error("Unable to load MySQL Connector, please check that the library was imported correctly."));
  }
};

exports.getConfiguredTowers = (callback) => {
  query("SELECT * FROM tower_instances",[], (error, results) => {
    if (error) {
      callback(error, null)
    }
    else {
      callback(null, results);
    }
  });
};

exports.isTowerConnected = (id, callback) => {
  query("SELECT * FROM tower_instances WHERE id = ?", [id], (error, results) => {
    if (error) callback(error, null);
    else {
      const { id, name, protocol, host, port, strict_ssl, username, password } = results[0];

      let client = new TowerClient();

      client.check_tower_connectivity(protocol, host, port, strict_ssl, username, password).then(() => {
        callback(null, true);
      }).catch(error => {
        callback(error, null);
      });
    }
  });
};

exports.updateTowerConnectedState = (id, status, callback) => {
    query("UPDATE tower_instances SET connected = ? WHERE id = ?", [status, id], function (error) {
        if (error) callback(error, null);
    });

    let current_date = new Date().toLocaleString();

    query("UPDATE tower_instances SET checked_in = ? WHERE id = ?", [current_date, id], function (error, results) {
        if (error) callback(error, null);
        callback(null, results);
    });
};

exports.getTowerInstance = (id, callback) => {
    query("SELECT * FROM tower_instances WHERE id = ?", [id], function(error, result) {
        if (error) callback(error, null)
        else callback(null, result);
    });
};

exports.updateTowerInstance = (id, name, protocol, host, port, strict_ssl, username, password, secret_key,
                               database_username, database_password, database_host, database_port, database_name, callback) => {
  query("UPDATE tower_instances SET name = ?, protocol = ?, host = ?, port = ?, strict_ssl = ?, username = ?, password = ?, " +
    "secret_key = ?, database_username = ?, database_password = ?, database_host = ?, database_port = ?, database_name = ? WHERE id = ?",
      [name, protocol, host, port, strict_ssl, username, password, secret_key,
        database_username, database_password, database_host, database_port, database_name, id], function(error, results) {
      if (error) callback(error, null)
      else callback(null, results);
  });
};