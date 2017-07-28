const getUserBySession = rootRequire("server/data-access/functions/user/findBySession");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {session} = req.query;
    getUserBySession(session)
    .then(session => {
        resolve(session);
    })
    .catch(error => {
        reject("Session not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
