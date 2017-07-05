const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");

function Update(game, cb) {
    Game.findOneAndUpdate({_id: game._id}, game, {new: true})
        .exec((err, game) => {
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

module.exports = Update;
