const startGame = rootRequire("server/data-access/functions/game/startGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const {OZemails, gameId, HTMLlore, fileData} = req.body;
    startGame(OZemails, gameId, HTMLlore, fileData)
    .then(message => {
        res.status(201).json(message);
    })
    .catch(error => {
        res.status(400).send("Game not started: " + createErrorMessage(error));
    });
}

module.exports = Post;
