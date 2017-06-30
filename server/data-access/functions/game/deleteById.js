const Game = rootRequire("server/schemas/game");

function Delete (id, cb) {
    Game.findByIdAndRemove(id)
        .exec((err, doc) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: {} });
        });
};

module.exports = Delete;
