const Game = rootRequire("server/schemas/game");

function Update (game, cb) {
    Game.findOneAndUpdate({ _id: game._id }, game, { new: true })
        .exec((err, game) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: game });
        });
};

module.exports = Update;
