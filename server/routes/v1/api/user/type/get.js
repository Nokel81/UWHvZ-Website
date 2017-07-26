const getUserType = rootRequire("server/data-access/functions/user/findUserType");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {userId} = req.query;
    getUserType(userId)
    .then(type => {
        resolve(type);
    })
    .catch(error => {
        reject("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
