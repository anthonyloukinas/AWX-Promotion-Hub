/**
 * Application Entry Point
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
if(!process.env.NODE_ENV){
  process.env.NODE_ENV = 'development';
}
const chalk = require('chalk');
const config = require('./config/config');
const scheduler = require('./lib/scheduler');

// Init the express application
const app = require('./config/express')();

// Launch application on port 3000
app.listen(config.port, () => {
  console.log(
      chalk.bgGreen(`[awx-promotion-hub]`),
      chalk.bgRed(`[server]`),
      chalk.underline(`listening on *:${config.port}`)
  );

  scheduler.scheduleJobCheckTowerConnectivity();
});

// Logging initialization
console.log('-=========-');
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + null));
if (process.env.NODE_ENV === 'secure') {
  console.log(chalk.green('HTTPs:\t\t\t\ton'));
}
console.log('-=========-');

process.on('uncaughtException', function (err) {
  console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});