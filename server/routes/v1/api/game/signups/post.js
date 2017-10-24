const create = rootRequire("server/data-access/functions/gameSignups/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const signup = req.body;
    create(signup)
        .then(signups => {
            resolve(signups);
        })
        .catch(error => {
            reject("Signup not created: " + createErrorMessage(error));
        });
}

module.exports = Post;
