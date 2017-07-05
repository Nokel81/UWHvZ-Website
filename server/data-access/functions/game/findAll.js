const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");

function FindAll(cb) {
    Game.find({})
        .exec((err, games) => {
            if (err) {
                return cb({error: err});
            }
            let gameCount = 0;
            let errored = false;
            const res = [];
            games.forEach((game, index) => {
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

                                        res.push(gameRes);
                                        gameCount++;
                                        if (gameCount >= games.length) {
                                            cb({body: res});
                                        }
                                    });
                            });
                    });
            });
        });
}

module.exports = FindAll;
