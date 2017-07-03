const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Delete (id, cb) {
    GameSignUp.findByIdAndRemove(id)
        .exec((err, doc) => {
            if (err) {
                return cb({ error: err });
            }
            findByGame(doc.gameId, cb);
        });
};

module.exports = Delete;
