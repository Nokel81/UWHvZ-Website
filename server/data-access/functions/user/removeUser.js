const Promise = require("bluebird");

const findById = rootRequire("server/data-access/functions/user/findById");
const findUsersInfo = rootRequire("server/data-access/functions/user/findUsersInfo");
const User = rootRequire("server/schemas/user");

function RemoveUser(userId) {
    return new Promise(function(resolve, reject) {
        findById(userId)
            .then(user => {
                if (!user.confirmationToken) {
                    return reject("User's email has been confirmed, it is too dangerous to continue.");
                }
                return User.findByIdAndRemove(user._id).exec();
            })
            .then(() => {
                return findUsersInfo();
            })
            .then(users => {
                resolve(users);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = RemoveUser;
