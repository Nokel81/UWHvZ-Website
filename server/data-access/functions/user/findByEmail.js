const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");

function FindById(email) {
    return new Promise(function(resolve, reject) {
        User.findOne({
            email
        })
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
