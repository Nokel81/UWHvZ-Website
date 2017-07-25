const unsuppliedDeath = rootRequire("server/data-access/functions/game/unsuppliedDeath");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, res, next) {
    const {gameId} = req.query;
    unsuppliedDeath(gameId)
    .then(noerror => {
        res.sendStatus(204);
    })
    .catch(error => {
        res.status(400).send("Unsupplied not killed: " + createErrorMessage(error));
    });
}

module.exports = Delete;
