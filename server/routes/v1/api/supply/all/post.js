const create = rootRequire("server/data-access/functions/supplyCode/create");

function Post(req, res, next) {
    const supplyCodes = req.body.codes;
    const gameId = req.body.gameId;
    create(supplyCodes, gameId, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            const errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
            res.status(400).send("Supply Code not made: " + errors);
        } else {
            res.status(201).send(result.body);
        }
    });
}

module.exports = Post;
