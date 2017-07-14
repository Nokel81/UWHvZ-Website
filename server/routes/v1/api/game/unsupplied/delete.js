const unsuppliedDeath = rootRequire("server/data-access/functions/game/unsuppliedDeath");

function Delete(req, res, next) {
    unsuppliedDeath(req.query.gameId, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            if (result.error.errors) {
                const errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
                res.status(400).send("Unsupplied not killed: " + errors);
            } else {
                res.status(400).send("Unsupplied not killed: " + result.error);
            }
        } else {
            res.sendStatus(204);
        }
    });
}

module.exports = Delete;
