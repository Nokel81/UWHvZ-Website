const GameSignUp = rootRequire("server/schemas/gameSignUp");

function Delete (id, cb) {
    GameSignUp.findByIdAndRemove(id)
        .exec((err, doc) => {
            if (err) {
                return cb({ error: err });
            }
            GameSignUp.find({ gameId: doc.gameId })
                .sort({ userEmail: 1 })
                .exec((err, signups) => {
                    if (err) {
                        return cb({ error: err });
                    }
                    cb({ body: signups });
                });
        });
};

module.exports = Delete;
