const getUserById = rootRequire("server/data-access/functions/user/findById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {userId} = req.query;
    getUserById(userId)
    .then(user => {
        resolve(user);
    })
    .catch(error => {
        reject("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
