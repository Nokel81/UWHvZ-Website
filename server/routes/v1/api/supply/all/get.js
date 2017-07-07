const findByGame = rootRequire("server/data-access/functions/supplyCode/findByGame");

function Get(req, res, next) {
    findByGame(req.query.gameId, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Supply codes not found: " + result.error);
        } else {
            res.status(201).send(result.body);
        }
    });
}

module.exports = Get;