const create = rootRequire("server/data-access/functions/user/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const user = req.body;
    create(user)
        .then(user => {
            resolve(user);
        })
        .catch(error => {
            reject("Account not created: " + createErrorMessage(error));
        });
}

module.exports = Post;
