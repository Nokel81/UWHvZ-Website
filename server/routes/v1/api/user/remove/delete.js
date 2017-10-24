const removeUser = rootRequire("server/data-access/functions/user/removeUser");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, resolve, reject) {
    const {
        userId
    } = req.query;
    removeUser(userId)
        .then(users => {
            resolve(users);
        })
        .catch(error => {
            reject("User not removed: " + createErrorMessage(error));
        });
}

module.exports = Delete;
