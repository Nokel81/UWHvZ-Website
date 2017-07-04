const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Delete (id, cb) {
    GameSignUp.findByIdAndRemove(id)
        .exec((err, doc) => {
            if (err) {
                return cb({ error: err });
            }
            if (doc) {
                findByGame(doc.gameId, cb);
            } else {
                FindCurrentOrNext(res => {
                    if (res.error) {
                        return cb({ error: res.error });
                    }
                    findByGame((res.body || {})._id, cb);
                })
            }
        });
};

module.exports = Delete;
