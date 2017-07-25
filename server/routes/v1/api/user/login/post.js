const login = rootRequire("server/data-access/functions/user/login");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const account = req.body;
    login(account)
    .then(accountInfo => {
        res.status(200).json(accountInfo);
    })
    .catch(error => {
        res.status(404).send("Login failed: " + createErrorMessage(error));
    });
}

module.exports = Post;
