const forceChangePassword = rootRequire("server/data-access/functions/user/forceChangePassword");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const passwordChange = req.body;
    forceChangePassword(passwordChange)
    .then(message => {
        resolve(message);
    })
    .catch(error => {
        reject("Password not changed: " + createErrorMessage(error));
    });
}

module.exports = Put;
