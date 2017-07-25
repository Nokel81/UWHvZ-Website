const create = rootRequire("server/data-access/functions/gameSignups/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const signup = req.body;
    create(signup)
    .then(signups => {
        res.status(200).json(signups);
    })
    .catch(error => {
        res.status(400).send("Signup not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
