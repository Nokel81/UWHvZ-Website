const getUserById = rootRequire("server/data-access/functions/user/findById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {userId} = req.query;
    getUserById(userId)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => {
        res.status(404).send("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
