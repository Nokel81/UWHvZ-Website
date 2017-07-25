const modifyPlayerListOfGame = rootRequire("server/data-access/functions/game/modifyPlayerListOfGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, res, next) {
    const {gameId, userId, team} = req.query;
    modifyPlayerListOfGame(gameId, userId, team, "$pull")
    .then(games => {
        res.status(201).json(games);
    })
    .catch(error => {
        res.status(400).send("Player not removed: " + createErrorMessage(error));
    });
}

module.exports = Delete;
