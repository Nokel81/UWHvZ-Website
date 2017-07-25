const isSuper = rootRequire("server/data-access/functions/user/isSuper");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {userId} = req.query;
    isSuper(userId)
    .then(isSuper => {
        res.status(200).json(isSuper);
    })
    .catch(error => {
        res.status(404).send("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
