const changePassword = rootRequire("server/data-access/functions/user/changePassword");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const passwordChange = req.body;
    const {userId} = req.headers;
    changePassword(passwordChange, userId)
    .then(message => {
        resolve(message);
    })
    .catch(error => {
        reject("Password not changed: " + createErrorMessage(error));
    });
}

module.exports = Put;
