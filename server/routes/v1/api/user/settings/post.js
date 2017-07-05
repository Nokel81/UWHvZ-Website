const updateUserSettings = rootRequire("server/data-access/functions/user/updateUserSettings");

function Post(req, res, next) {
    updateUserSettings(req.body, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            const errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
            res.status(400).send("Settings not updated: " + errors);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Post;
