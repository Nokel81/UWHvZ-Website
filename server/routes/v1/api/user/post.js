const create = rootRequire("server/data-access/functions/user/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const user = req.body;
    create(user)
    .then(user => {
        res.status(200).send(user);
    })
    .catch(error => {
        res.status(400).send("Account not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
