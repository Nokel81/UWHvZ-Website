const updateUserSettings = rootRequire("server/data-access/functions/user/updateUserSettings");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const settings = req.body;
    updateUserSettings(settings)
    .then(settings => {
        res.status(200).json(settings);
    })
    .catch(error => {
        res.status(404).send("Settings not updated: " + createErrorMessage(error));
    });
}

module.exports = Post;
