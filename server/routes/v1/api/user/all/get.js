const getUsersInfo = rootRequire("server/data-access/functions/user/findUsersInfo");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    getUsersInfo()
        .then(info => {
            resolve(info);
        })
        .catch(error => {
            reject("Users not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
