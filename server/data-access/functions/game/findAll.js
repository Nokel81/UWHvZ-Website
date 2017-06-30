const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");

function FindAll (cb) {
    Game.find({})
        .exec((err, games) => {
            if (err) {
                return cb({ error: err });
            }
            let game_count = 0;
            let errored = false;
            let res = [];
            games.forEach(function (game, index) {
                User.find({
                        _id: { $in: game.moderators }
                    })
                    .select("-password -nonce")
                    .exec((err, mods) => {
                        if (err) {
                            if (!errored) {
                                errored = true;
                                cb({ error: err });
                            }
                            return;
                        }
                        User.find({
                                _id: { $in: game.humans }
                            })
                            .select("-password -nonce")
                            .exec(function (err, hums) {
                                if (err) {
                                    if (!errored) {
                                        errored = true;
                                        cb({ error: err });
                                    }
                                    return;
                                }

                                User.find({
                                        _id: { $in: game.zombies }
                                    })
                                    .select("-password -nonce")
                                    .exec(function (err, zombs) {
                                        if (err) {
                                            if (!errored) {
                                                errored = true;
                                                cb({ error: err });
                                            }
                                            return;
                                        }
                                        let game_res = JSON.parse(JSON.stringify(game));
                                        game_res.moderator_objs = mods;
                                        game_res.human_objs = hums;
                                        game_res.zombie_objs = zombs;

                                        res.push(game_res);
                                        game_count++;
                                        if (game_count >= games.length) {
                                            cb({ body: res });
                                        }
                                    });
                            });
                    });
            });
        });
};

module.exports = FindAll;
