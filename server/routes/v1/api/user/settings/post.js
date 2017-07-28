const updateUserSettings = rootRequire("server/data-access/functions/user/updateUserSettings");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const settings = req.body;
    updateUserSettings(settings)
    .then(settings => {
        resolve(settings);
    })
    .catch(error => {
        reject("Settings not updated: " + createErrorMessage(error));
    });
}

module.exports = Post;
