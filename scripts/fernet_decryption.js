function callScript() {
  let spawn = require("child_process").spawn;

  let process = spawn("python3", ["../fernet_decrypt.py", "password", "5", "$encrypted$UTF8$AESCBC$Z0FBQUFBQmVPNnNnc2YyeUV0NGlfbld4NktqTHEtYlplMlhxcENLeVBtWVVUendudUp6VXV6S1VCalhRLU9sSERDTUg4Z2w1UnJRWEF0ZnNuNlJRemtZdW5Lazk3Q1hEZEE9PQ=="]);

  process.stdout.on('data', function(data) {
    console.log(data.toString());
  });
}

const { decryptCredential } = require("../lib/utilities/core");

decryptCredential("password", "5", "$encrypted$UTF8$AESCBC$Z0FBQUFBQmVPNnNnc2YyeUV0NGlfbld4NktqTHEtYlplMlhxcENLeVBtWVVUendudUp6VXV6S1VCalhRLU9sSERDTUg4Z2w1UnJRWEF0ZnNuNlJRemtZdW5Lazk3Q1hEZEE9PQ==", function (error, results) {
  console.log(results);
});