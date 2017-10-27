const update = rootRequire("server/data-access/functions/user/update");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const user = req.body;
    update(user)
        .then(users => {
            resolve(users);
        })
        .catch(error => {
            reject("Account not updated: " + createErrorMessage(error));
        });
}

module.exports = Put;
