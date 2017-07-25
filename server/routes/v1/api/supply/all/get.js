const findByGame = rootRequire("server/data-access/functions/supplyCode/findByGame");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {gameId} = req.query;
    findByGame(gameId)
    .then(codes => {
        res.status(201).json(codes);
    })
    .catch(error => {
        res.status(404).send("Supply codes not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
