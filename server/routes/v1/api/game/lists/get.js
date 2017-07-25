const findGamePlayers = rootRequire("server/data-access/functions/game/findGamePlayers");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {gameId, userId} = req.query;
    findGamePlayers(gameId, userId)
    .then(playerInfo => {
        res.status(200).json(playerInfo);
    })
    .catch(error => {
        res.status(404).send("Game's players not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
