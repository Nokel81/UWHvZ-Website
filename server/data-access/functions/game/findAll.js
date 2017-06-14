const Game = rootRequire("server/schemas/game");

function FindAll (cb) {
    Game.find({})
        .exec((err, reports) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: reports });
        });
};

module.exports = FindAll;
