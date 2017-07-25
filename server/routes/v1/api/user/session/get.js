const getUserBySession = rootRequire("server/data-access/functions/user/findBySession");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {session} = req.query;
    getUserBySession(session)
    .then(session => {
        res.status(200).json(session);
    })
    .catch(error => {
        res.status(404).send("Session not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
