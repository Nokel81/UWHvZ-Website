const login = rootRequire("server/data-access/functions/user/login");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const account = req.body;
    login(account)
        .then(accountInfo => {
            resolve(accountInfo);
        })
        .catch(error => {
            reject("Login failed: " + createErrorMessage(error));
        });
}

module.exports = Post;
