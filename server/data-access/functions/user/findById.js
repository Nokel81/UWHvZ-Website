const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");

function FindById(_id, withNonce) {
    return new Promise(function(resolve, reject) {
        User.findOne({
            _id
        })
            .select("-password" + withNonce ? "" : " -nonce")
            .exec()
            .then(user => {
                resolve(user);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindById;
