const getUserInfo = rootRequire("server/data-access/functions/user/findUserInfo");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        userId
    } = req.headers;
    getUserInfo(userId)
        .then(info => {
            resolve(info);
        })
        .catch(error => {
            reject("User not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
