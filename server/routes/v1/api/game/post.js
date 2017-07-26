const create = rootRequire("server/data-access/functions/game/create");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const game = req.body;
    create(game)
    .then(game => {
        resolve(game);
    })
    .catch(error => {
        reject("Game not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
