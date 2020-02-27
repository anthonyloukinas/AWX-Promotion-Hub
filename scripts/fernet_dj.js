const fernet = require('fernet');

fernet.Secret = function(secret64) {
  let secret = fernet.decode64toHex(secret64);

  if (secret.length !== fernet.hexBits(512)) {
    throw new Error('Secret must be 64 url-safe base64-encoded bytes.');
  }

  this.signingKeyHex    = secret.slice(0,fernet.hexBits(256));
  this.signingKey       = fernet.Hex.parse(this.signingKeyHex);
  this.encryptionKeyHex = secret.slice(fernet.hexBits(256));
  this.encryptionKey    = fernet.Hex.parse(this.encryptionKeyHex);
};

// aabbcc
let secret = new fernet.Secret("Oefepu5hG4y3l5rtsW5gAqh4p8dcXbaW-896klYRMW-sjn0FDjiP9KBG17LmkCUaCea6fB9KgUB9NNjxPRDggg==");

let token = new fernet.Token({
  secret: secret,
  token: 'Z0FBQUFBQmQzQ25wMGtxVm1uaDZ5RkFyQWJNOWpkVFBvOTNBaWxpVU1rNjk1VkM0Ym5faTBlOHBQVXlmZXFCNHc3OUZuOUFMdURuNVViU1lrVWtDVmxRMUMtZjJmYWVNalE9PQ=='}, ttl=0);

token.decode();