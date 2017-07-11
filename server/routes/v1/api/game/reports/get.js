const findByGame = rootRequire("server/data-access/functions/report/findByGame");

function Get(req, res, next) {
    findByGame(req.query.gameId, req.query.needToBeRatified === "true", result => {
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
