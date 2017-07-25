const findPlayerCodes = rootRequire("server/data-access/functions/game/findPlayerCodes");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {gameId, userId} = req.query;
    findPlayerCodes(gameId, userId)
    .then(codes => {
        res.status(200).json(codes);
    })
    .catch(error => {
        res.status(404).send("Player codes not found: " + createErrorMessage(error));
    });
    findPlayerCodes(req.query.gameId, req.query.userId, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Game not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Get;
