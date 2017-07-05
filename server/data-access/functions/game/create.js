const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");

function Create(game, cb) {
    game = new Game(game);
    game.save(err => {
        if (err) {
            return cb({error: err});
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
                                const res = JSON.parse(JSON.stringify(game));
                                res.moderatorObjs = mods;
                                res.humanObjs = hums;
                                res.zombieObjs = zombs;

                                cb({body: res});
                            });
                    });
            });
    });
}

module.exports = Create;
