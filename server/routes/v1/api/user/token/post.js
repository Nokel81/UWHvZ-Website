const confirmUser = rootRequire("server/data-access/functions/user/confirmUser");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const {token} = rqe.body;
    confirmUser(token)
    .then(message => {
        resolve(message);
    })
    .catch(error => {
        reject("Email not confirmed: " + createErrorMessage(error));
    });
}

module.exports = Post;
