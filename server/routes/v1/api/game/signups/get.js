const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {gameId} = req.query;
    findByGame(gameId)
    .then(signups => {
        res.status(200).json(signups);
    })
    .catch(error => {
        res.status(400).send("Signups not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
