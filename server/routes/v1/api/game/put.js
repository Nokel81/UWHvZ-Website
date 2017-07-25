const update = rootRequire("server/data-access/functions/game/update");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, res, next) {
    const game = req.body;
    update(game)
    .then(game => {
        res.status(202).json(game);
    })
    .catch(error => {
        res.status(400).send("Game not updated: " + createErrorMessage(error));
    });
}

module.exports = Put;
