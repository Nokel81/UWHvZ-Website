const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Get(req, res, next) {
    findByGame(req.query.gameId, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Signups not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Get;
