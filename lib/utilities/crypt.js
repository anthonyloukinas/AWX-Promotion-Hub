/**
 * Module dependencies
 */
const fernet = require('../fernet'),
  atob = require('atob'),
  crypto = require('crypto');

/**
 * Decrypt Credential from Postgres Database function
 * @param secret_key
 * @param inputs
 * @param pk_id
 */
exports.decryptCredential = (secret_key, inputs, pk_id, callback) => {

  let errors = [];
  let decrypted_value;

  for (const input in inputs) {
    let field_name = input;
    let raw_data = inputs[input];

    let hash = crypto.createHash('sha512')
                     .update(secret_key)
                     .update(pk_id.toString())
                     .update(field_name)
                     .digest('base64');

    // remove $encrypted$ from start of string
    raw_data = raw_data.slice('$encrypted$'.length, -1);
  
  // check string is utf8
    if (raw_data.startsWith('UTF8$')) {
      raw_data = raw_data.slice('UTF8$'.length, -1);
    }
  
  // check algo
    let algo = raw_data.split('$', 1);
  
    if (algo != 'AESCBC') {
      // callback(new Error(`Unsupported algorithm: ${algo}`), null);
      continue;
    }
  
    let encrypted_value = raw_data.split('$', 2)[1];

    let token = new fernet.Token({
      secret: new fernet.Secret(hash),
      token: atob(encrypted_value)
    });
    
    try{
      decrypted_value = token.decode();
    } catch (e) {
      errors.push(e);
    }
  }

  if (errors.length == 0) {
    callback(null, decrypted_value);
  } else {
    callback(errors, null);
  }
};