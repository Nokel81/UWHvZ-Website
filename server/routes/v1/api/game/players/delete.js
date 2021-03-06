const modifyPlayerListOfGame = rootRequire("server/data-access/functions/game/modifyPlayerListOfGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, resolve, reject) {
    const {
        gameId,
        userId,
        team
    } = req.query;
    modifyPlayerListOfGame(gameId, null, team, "$pull", userId)
        .then(games => {
            resolve(games);
        })
        .catch(error => {
            reject("Player not removed: " + createErrorMessage(error));
        });
}

module.exports = Delete;
