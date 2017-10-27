const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");

function FindBasicUserInfo() {
    return new Promise(function(resolve, reject) {
        User.find({})
            .sort("playerName")
            .select("playerName playerCode email confirmationToken")
            .exec()
            .then(users => {
                resolve(users);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindBasicUserInfo;
