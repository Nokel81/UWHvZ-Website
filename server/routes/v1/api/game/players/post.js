const modifyPlayerListOfGame = rootRequire("server/data-access/functions/game/modifyPlayerListOfGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Post(req, resolve, reject) {
    const {
        gameId,
        playerCode,
        team
    } = req.body;
    modifyPlayerListOfGame(gameId, playerCode, team, "$push")
        .then(games => {
            resolve(games);
        })
        .catch(error => {
            reject("Game not created: " + createErrorMessage(error));
        });
}

module.exports = Post;
