const update = rootRequire("server/data-access/functions/game/update");

function Put(req, res, next) {
    const updatedGame = req.body;
    update(updatedGame, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Game not updated: " + result.error);
        } else {
            res.status(202).send(result.body);
        }
    });
}

module.exports = Put;
