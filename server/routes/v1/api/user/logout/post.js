const logout = rootRequire("server/data-access/functions/user/logout");

function Post(req, res, next) {
    const session = req.body.session;
    logout(session, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send(result.error);
        } else {
            res.status(205).send("Logged Out");
        }
    });
};

module.exports = Post;
