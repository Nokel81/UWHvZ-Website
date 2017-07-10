const addPlayerToGame = rootRequire("server/data-access/functions/game/addPlayerToGame");

function Post(req, res, next) {
    const newPlayer = req.body;
    addPlayerToGame(newPlayer, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            if (result.error.errors) {
                const errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
                res.status(400).send("Game not created: " + errors);
            } else {
                res.status(400).send("Game not created: " + result.error);
            }
        } else {
            res.status(201).send(result.body);
        }
    });
}

module.exports = Post;
