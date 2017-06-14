const Game = rootRequire("server/schemas/game");

function FindById(id, cb) {
    Game.find({ _id: id })
        .exec((err, reports) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: reports });
        });
};

module.exports = FindById;
