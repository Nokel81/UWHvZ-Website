const confirmUser = rootRequire("server/data-access/functions/user/confirmUser");

function Post(req, res, next) {
    confirmUser(req.body.token, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            const errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
            res.status(400).send("Email not confirmed: " + errors);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Post;
