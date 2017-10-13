const Promise = require("bluebird");
const randomString = require("crypto-random-string");

const User = rootRequire("server/schemas/user");
const mailService = rootRequire("server/services/mail");

function ConfirmUser(email) {
    return new Promise(function(resolve, reject) {
        User.findOneAndUpdate({
            email
        }, {
            $set: {
                passwordResetCode: randomString(25)
            }
        }, {
            new: true
        })
            .exec()
            .then(user => {
                return mailService.sendPasswordResetEmail(user);
            })
            .then(message => {
                resolve(message);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = ConfirmUser;
