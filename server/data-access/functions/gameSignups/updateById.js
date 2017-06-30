const GameSignUp = rootRequire("server/schemas/gameSignUp");

function Update (signUp, cb) {
    GameSignUp.findOneAndUpdate({ _id: signUp._id }, signUp)
        .exec((err, signUp) => {
            if (err) {
                return cb({ error: err });
            }
            GameSignUp.find({ gameId: signUp.gameId })
                .sort({ userEmail: 1 })
                .exec((err, games) => {
                    if (err) {
                        return cb({ error: err });
                    }
                    cb({ body: games });
                });
        });
};

module.exports = Update;
