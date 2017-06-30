const GameSignUp = rootRequire("server/schemas/gameSignUp");

function FindById(gameId, cb) {
    GameSignUp.find({ gameId: gameId })
        .exec((err, signUps) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: signUps });
        });
};

module.exports = FindById;
