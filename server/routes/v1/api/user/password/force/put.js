const forceChangePassword = rootRequire("server/data-access/functions/user/forceChangePassword");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, res, next) {
    const passwordChange = req.body;
    forceChangePassword(passwordChange)
    .then(message => {
        res.status(200).send(message);
    })
    .catch(error => {
        res.status(404).send("Password not changed: " + createErrorMessage(error));
    });
}

module.exports = Put;
