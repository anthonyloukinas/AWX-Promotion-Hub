/**
 * Scheduler
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const schedule = require('node-schedule');
const TowerClient = require('./towerClient');
const database = require('./utilities/database');

const scheduler = {
    scheduleJobCheckTowerConnectivity: function() {
        return schedule.scheduleJob('*/30 * * * *', function() { // every 30 minutes
            let client = new TowerClient();

            database.getConfiguredTowers(function(error, instances) {
               instances.forEach(instance => {
                   console.log(instance);
                   const { id, protocol, host, port, strict_ssl, username, password } = instance;
                   client.check_tower_connectivity(protocol, host, port, strict_ssl, username, password).then(() => {
                       database.updateTowerConnectedState(id, true, function(error) {
                            if (error) console.error("[scheduler] Unable to set connected status in database.");
                       });
                   }).catch(error => {
                       database.updateTowerConnectedState(id, false, function(error) {
                           if (error) console.error("[scheduler] Unable to set connected status in database.");
                       });
                   })
               });
            });
        });
    }
};

module.exports = scheduler;