const create = rootRequire("server/data-access/functions/game/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const game = req.body;
    create(game)
    .then(game => {
        res.status(201).json(game);
    })
    .catch(error => {
        res.status(400).send("Game not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
