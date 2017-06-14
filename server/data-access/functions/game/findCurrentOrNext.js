const Game = rootRequire("server/schemas/game");

function FindCurrentOrNext (cb) {
    Game.find({ endDate: { $gte: new Date() }})
        .limit(1)
        .sort({ endDate: -1 })
        .exec((err, games) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: games[0] });
        });
};

module.exports = FindCurrentOrNext;
