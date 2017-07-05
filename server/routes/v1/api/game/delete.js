const deleteById = rootRequire("server/data-access/functions/game/deleteById");

function Delete(req, res, next) {
    deleteById(req.query.id, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(404).send("Game not removed: " + result.error);
        } else {
            res.sendStatus(204);
        }
    });
}

module.exports = Delete;
