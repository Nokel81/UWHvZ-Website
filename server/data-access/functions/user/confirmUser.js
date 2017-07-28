const Promise = require('bluebird');

const User = rootRequire("server/schemas/user");

function ConfirmUser(confirmationToken) {
    return new Promise(function(resolve, reject) {
        User.find({confirmationToken})
        .exec()
        .then(users => {
            if (!users[0]) {
                return resolve("User email confirmed");
            }
            let _id = users[0]._id;
            return User.updateOne({_id}, {$unset: {confirmationToken: 1}}).exec();
        })
        .then(user => {
            resolve("User email confirmed");
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = ConfirmUser;
