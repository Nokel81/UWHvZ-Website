const logout = rootRequire("server/data-access/functions/user/logout");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const session = req.body;
    logout(session)
    .then(message => {
        res.status(205).json(message);
    })
    .catch(error => {
        res.status(400).send("Could not log out:" + createErrorMessage(error));
    });
}

module.exports = Post;
