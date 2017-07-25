const getUserType = rootRequire("server/data-access/functions/user/findUserType");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {userId} = req.query;
    getUserType(userId)
    .then(type => {
        res.status(200).json(type);
    })
    .catch(error => {
        res.status(404).send("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
