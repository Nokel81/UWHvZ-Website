const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");

function FindById(id, cb) {
    Game.findOne({_id: id})
        .exec((err, game) => {
            if (err) {
                return cb({error: err});
            }
            if (!game) {
                return cb({error: "No game found"});
            }
            User.find({
                _id: {$in: game.moderators}
            })
            .select("-password -nonce")
            .exec((err, mods) => {
                if (err) {
                    return cb({error: err});
                }
                User.find({
                    _id: {$in: game.humans}
                })
                .select("-password -nonce")
                .exec((err, hums) => {
                    if (err) {
                        return cb({error: err});
                    }

                    User.find({
                        _id: {$in: game.zombies}
                    })
                    .select("-password -nonce")
                    .exec((err, zombs) => {
                        if (err) {
                            return cb({error: err});
                        }
                        User.find({
                            _id: {$in: game.spectators}
                        })
                        .select("-password -nonce")
                        .exec((err, specs) => {
                            if (err) {
                                return cb({error: err});
                            }
                            const gameRes = JSON.parse(JSON.stringify(game));
                            gameRes.moderatorObjs = mods;
                            gameRes.humanObjs = hums;
                            gameRes.zombieObjs = zombs;
                            gameRes.spectatorObjs = specs;

                            cb({body: gameRes});
                        });
                    });
                });
            });
        });
}

module.exports = FindById;
