const getUserSettings = rootRequire("server/data-access/functions/user/findUserSettings");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {userId} = req.query;
    getUserSettings(userId)
    .then(settings => {
        resolve(settings);
    })
    .catch(error => {
        reject("Settings not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
