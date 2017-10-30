const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");
const findById = rootRequire("server/data-access/functions/user/findById");
const hashPassword = rootRequire("server/helpers/hashPassword");

function ConfirmUser(passwordChange, userId) {
    return new Promise(function(resolve, reject) {
        findById(userId, true)
            .then(user => {
                return Promise.join(hashPassword(passwordChange.oldPassword, user.nonce), hashPassword(passwordChange.newPassword, user.nonce), (oldHash, newHash) => {
                    if (oldHash !== user.password) {
                        return reject("Old password is incorrect");
                    }
                    return User.updateOne({
                        _id: userId
                    }, {
                        $set: {
                            password: newHash
                        }
                    }).exec();
                });
            })
            .then(() => {
                resolve("Password changed");
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = ConfirmUser;
