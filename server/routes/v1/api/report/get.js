const findByGame = rootRequire("server/data-access/functions/report/findByGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {gameId} = req.query;
    findByGame(gameId, false)
    .then(reports => {
        res.status(200).send(reports);
    })
    .catch(error => {
        res.status(400).send("Game reports not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
