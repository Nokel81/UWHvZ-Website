const GameSignUp = rootRequire("server/schemas/gameSignUp");

function Create (gameSignUp, cb) {
    gameSignUp = new GameSignUp(gameSignUp);
    gameSignUp.validate(err => {
        if (err) {
            return cb({ error: err });
        }
        gameSignUp.save(err => {
            if (err) {
                return cb({ error: err });
            }
            GameSignUp.find({ gameId: gameSignUp.gameId })
                .sort({ userEmail: 1 })
                .exec((err, games) => {
                    if (err) {
                        return cb({ error: err });
                    }
                    cb({ body: games });
                });
        });
    });
};

module.exports = Create;
