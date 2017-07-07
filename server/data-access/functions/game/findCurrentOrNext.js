const Game = rootRequire("server/schemas/game");

function FindCurrentOrNext(cb) {
    Game.findOne({endDate: {$gte: new Date()}})
        .sort({endDate: -1})
        .exec((err, game) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: game});
        });
}

module.exports = FindCurrentOrNext;
