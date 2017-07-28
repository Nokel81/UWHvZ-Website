const Promise = require('bluebird');

const User = rootRequire("server/schemas/user");

function FindByPlayerCode(playerCode) {
    return new Promise(function(resolve, reject) {
        User.findOne({playerCode})
        .select("-password -nonce")
        .exec()
        .then(user => {
            resolve(user);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = FindByPlayerCode;
