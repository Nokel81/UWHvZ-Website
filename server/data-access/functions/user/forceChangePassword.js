const Promise = require('bluebird');

const User = rootRequire("server/schemas/user");
const hashPassword = rootRequire("server/helpers/hashPassword");

function ForcePasswordChange(passwordReset) {
    return new Promise(function(resolve, reject) {
        let _id = null;
        User.findOne({passwordResetCode: passwordReset.code})
        .exec()
        .then(user => {
            _id = user._id;
            return hashPassword(passwordReset.newPassword, user.nonce);
        })
        .then(password => {
            return User.updateOne({_id}, {$set: {password}, $unset: {passwordResetCode: 1}}).exec()
        })
        .then(user => {
            resolve("Password has been changed");
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = ForcePasswordChange;
