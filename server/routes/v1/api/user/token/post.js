const confirmUser = rootRequire("server/data-access/functions/user/confirmUser");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const {token} = rqe.body;
    confirmUser(token)
    .then(message => {
        res.status(200).send(message);
    })
    .catch(error => {
        res.status(400).send("Email not confirmed: " + createErrorMessage(error));
    });
}

module.exports = Post;
