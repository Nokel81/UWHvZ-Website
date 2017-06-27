const logout = rootRequire("server/data-access/functions/user/logout");

function Post(req, res, next) {
    const session = req.body;
    logout(session, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            let errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
            res.status(400).send(errors);
        } else {
            res.status(205).send("Logged Out");
        }
    });
};

module.exports = Post;
