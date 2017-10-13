const findGamePlayers = rootRequire("server/data-access/functions/game/findGamePlayers");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const { gameId } = req.query;
    const { userId } = req.headers;
    findGamePlayers(gameId, userId)
        .then(playerInfo => {
            resolve(playerInfo);
        })
        .catch(error => {
            reject("Game's players not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
