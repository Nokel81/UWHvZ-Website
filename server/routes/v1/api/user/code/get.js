const getUserByPlayerCode = rootRequire("server/data-access/functions/user/findByPlayerCode");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {playerCode} = req.query.playerCode;
    getUserByPlayerCode(playerCode)
    .then(user => {
        resolve(user);
    })
    .catch(error => {
        reject("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
