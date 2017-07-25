const getUserByPlayerCode = rootRequire("server/data-access/functions/user/findByPlayerCode");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {playerCode} = req.query.playerCode;
    getUserByPlayerCode(playerCode)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => {
        res.status(404).send("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
