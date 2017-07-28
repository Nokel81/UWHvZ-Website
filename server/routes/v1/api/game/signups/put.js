const updateById = rootRequire("server/data-access/functions/gameSignups/updateById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, resolve, reject) {
    const signup = req.body;
    updateById(signup)
    .then(signups => {
        resolve(signups);
    })
    .catch(error => {
        reject("Signup not updated: " + createErrorMessage(error));
    });
}

module.exports = Put;
