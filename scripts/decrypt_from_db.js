const database = require('../lib/postgres');
const crypt = require('../lib/utilities/crypt');

database.query("SELECT id, name, inputs FROM main_credential WHERE id = 3", [], (err, res) => {
  if (err) throw err;
  let credential_row = res.rows[0];

  let pk_id = credential_row.id;
  let secret_key = 'aabbcc';
  let inputs = credential_row.inputs;

  crypt.decryptCredential(secret_key, inputs, pk_id, (error, results) => {
    if (error) throw error;
    console.log(results);
    console.log();
  });
});

database.query("SELECT id, name, inputs FROM main_credential WHERE id = 4", [], (err, res) => {
  if (err) throw err;
  let credential_row = res.rows[0];

  let pk_id = credential_row.id;
  let secret_key = 'aabbcc';
  let inputs = credential_row.inputs;

  crypt.decryptCredential(secret_key, inputs, pk_id, (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});