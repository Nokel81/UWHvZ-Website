const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");

function FindCurrentOrNext(cb) {
    Game.findOne({endDate: {$gte: new Date()}})
        .sort({endDate: -1})
        .exec((err, game) => {
            if (err) {
                return cb({error: err});
            }
            if (!game) {
                return cb({error: "No next or current game"});
            }
            findById(game._id, cb);
        });
}

module.exports = FindCurrentOrNext;
