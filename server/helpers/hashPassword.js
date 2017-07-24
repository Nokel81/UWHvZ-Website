const Promise = require('bluebird');

const pbkdf2 = Promise.promisify(require("pbkdf2").pbkdf2);

function HashPassword(password, nonce) {
    return new Promise(function(resolve, reject) {
        pbkdf2(password, Buffer.from(nonce, "utf8"), 128, 256, "sha512")
        .then(buffer => {
            resolve(buffer.toString("hex"));
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = HashPassword;
