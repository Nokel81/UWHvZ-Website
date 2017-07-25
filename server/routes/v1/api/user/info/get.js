const getUserInfo = rootRequire("server/data-access/functions/user/findUserInfo");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {id} = req.query;
    getUserInfo(id)
    .then(info => {
        res.status(200).json(info);
    })
    .catch(error => {
        res.status(404).send("User not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
