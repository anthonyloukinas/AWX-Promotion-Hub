/**
 * Admin Server Controller
 * Handles logic for all routes matching "/admin"
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const TowerClient = require('../lib/towerClient'),
  database = require('../lib/utilities/database');

/**
 * Handles logic for "/admin/settings".
 * @param req - Express Request
 * @param res - Express Response
 */
exports.getSettings = (req, res) => {
  res.render('admin/Settings', { page_name: 'admin_settings', username: req.user.username });
};

exports.getTowerClusters = (req, res) => {
  console.log("before the database call");
  database.getConfiguredTowers(function(error, results) {
    if (error) {
      res.status(500).send({
        status: 500,
        message: "Server encountered a fatal database error.",
        error: error
      });
    } else {
      console.log("trying to render the page");
      res.render('admin/TowerClusters', {
        page_name: 'admin_settings_tower_clusters',
        username: req.user.username,
        tower_instances: results
      });
    }
  });
};

/**
 * Handles logic for "/admin/
 * @param req
 * @param res
 */
exports.getTowerCluster = (req, res) => {
  let id = req.params.id;
  database.getTowerInstance(id, function (error, result) {
    if (error) res.send("error")
    else res.render('admin/TowerCluster', {
      page_name: 'admin_settings_tower_cluster',
      username: req.user.username,
      tower_instance: result[0]
    });
  });
};

exports.postTowerCluster = (req, res) => {
  let id = req.params.id;
  const {
    instanceName: name,
    instanceProtocol: protocol,
    instancePort: port,
    instanceStrictSsl: strict_ssl,
    instanceHost: host,
    instanceUsername: username,
    instancePassword: password,
    instanceSecretKey: secret_key } = req.body;
  console.log(req.body);
  database.updateTowerInstance(id, name, protocol, host, port, strict_ssl, username, password, secret_key, function(error, results) {
    if (error) {
      console.log(error);
      res.send("error")
    }
    else {
      res.redirect('/admin/settings/tower_clusters');
    }
  });
};

exports.getTowerClustersCheckIn = (req, res) => {
  let id = req.params.id;
  database.isTowerConnected(id, function(error, connected) {
    if (error) database.updateTowerConnectedState(id, false, function(err) {
      if (err) console.error(err);
    })
    else {
      if (connected) database.updateTowerConnectedState(id, true, function(err) {
        if (err) console.error(err);
      })
      else database.updateTowerConnectedState(id, false, function(err) {
        if (err) console.error(err);
      });
    }
    res.redirect('/admin/settings/tower_clusters');
  });
};

// /admin/check_tower_connectivity/:id
// TODO probably remove this route
exports.getCheckTowerConnectivity = (req, res) => {
  database.isTowerConnected(req.params.id, function(error, connected) {
    if (error) {
      res.status(500).send({
        status: 500,
        response: "There was an error",
        error: error
      });
    }
    else if (connected) {
      res.status(200).send({
        status: 200,
        response: "Server is connected"
      });
    } else {
      res.status(301).send({
        status: 301,
        response: "Server is not connected"
      });
    }
  });
};

