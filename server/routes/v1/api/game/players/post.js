const modifyPlayerListOfGame = rootRequire("server/data-access/functions/game/modifyPlayerListOfGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, res, next) {
    const {gameId, playerCode, team} = req.body;
    modifyPlayerListOfGame(gameId, playerCode, team, "$push")
    .then(games => {
        res.status(201).send(games);
    })
    .catch(error => {
        res.status(400).send("Game not created: " + createErrorMessage(error));
    });
}

module.exports = Post;
