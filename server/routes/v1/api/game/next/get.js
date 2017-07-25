const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    findCurrentOrNext()
    .then(game => {
        res.status(200).json(game);
    })
    .catch(error => {
        res.status(404).send("Game not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
