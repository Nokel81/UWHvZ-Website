const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");

function FindByPlayerCode(playerCode) {
    return new Promise(function(resolve, reject) {
        playerCode = playerCode.toLowerCase();
        User.findOne({
            playerCode
        })
            .select("-password -nonce")
            .exec()
            .then(user => {
                resolve(user);
            })
            .catch(() => {
                reject("Invalid Player Code");
            });
    });
}

module.exports = FindByPlayerCode;
