const getUserSettings = rootRequire("server/data-access/functions/user/findUserSettings");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {userId} = req.query;
    getUserSettings(userId)
    .then(settings => {
        res.status(200).json(settings);
    })
    .catch(error => {
        res.status(404).send("Settings not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
