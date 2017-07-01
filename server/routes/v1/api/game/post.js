const create = rootRequire("server/data-access/functions/game/create");

function Post(req, res, next) {
    const newGame = req.body;
    create(newGame, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            let errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
            res.status(400).send("Game not created: " + result.error);
        } else {
            res.status(201).send(result.body);
        }
    });
};

module.exports = Post;
