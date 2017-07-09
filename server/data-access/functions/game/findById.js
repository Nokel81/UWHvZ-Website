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
                    if (!errored) {
                        errored = true;
                        cb({error: err});
                    }
                    return;
                }
                User.find({
                    _id: {$in: game.humans}
                })
                .select("-password -nonce")
                .exec((err, hums) => {
                    if (err) {
                        if (!errored) {
                            errored = true;
                            cb({error: err});
                        }
                        return;
                    }

                    User.find({
                        _id: {$in: game.zombies}
                    })
                    .select("-password -nonce")
                    .exec((err, zombs) => {
                        if (err) {
                            if (!errored) {
                                errored = true;
                                cb({error: err});
                            }
                            return;
                        }
                        const gameRes = JSON.parse(JSON.stringify(game));
                        gameRes.moderatorObjs = mods;
                        gameRes.humanObjs = hums;
                        gameRes.zombieObjs = zombs;

                        cb({body: gameRes});
                    });
                });
            });
        });
}

module.exports = FindById;
