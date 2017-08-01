const logout = rootRequire("server/data-access/functions/user/logout");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const {session} = req.headers;
    logout(session)
    .then(message => {
        resolve(message);
    })
    .catch(error => {
        reject("Could not log out:" + createErrorMessage(error));
    });
}

module.exports = Post;
