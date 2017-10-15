const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");

function findUsersInfo() {
    return new Promise(function(resolve, reject) {
        User.find({})
            .select("-password -nonce")
            .exec()
            .then(users => {
                resolve(users);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = findUsersInfo;
