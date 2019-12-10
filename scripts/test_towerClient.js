const TowerClient = require('../lib/towerClient');

let client = new TowerClient("localhost:8081", "admin", "password", "http");

client.launch_job_template(10).then(res => {
  console.log(res);
}).catch(err => {
  console.error(err);
})