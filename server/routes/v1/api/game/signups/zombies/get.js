const findByGameAndZombies = rootRequire("server/data-access/functions/gameSignups/findByGameAndZombies");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {gameId} = req.query;
    findByGameAndZombies(gameId)
    .then(signups => {
        res.status(200).json(signups);
    })
    .catch(error => {
        res.status(400).send("Signups not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
