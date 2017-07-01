const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");

function Create (game, cb) {
    game = new Game(game);
    game.save(err => {
        if (err) {
            return cb({ error: err });
        }
        User.find({
                _id: { $in: game.moderators }
            })
            .select("-password -nonce")
            .exec((err, mods) => {
                if (err) {
                    return cb({ error: err });
                }
                User.find({
                        _id: { $in: game.humans }
                    })
                    .select("-password -nonce")
                    .exec(function (err, hums) {
                        if (err) {
                            return cb({ error: err });
                        }

                        User.find({
                                _id: { $in: game.zombies }
                            })
                            .select("-password -nonce")
                            .exec(function (err, zombs) {
                                if (err) {
                                    return cb({ error: err });
                                }
                                let res = JSON.parse(JSON.stringify(game));
                                res.moderator_objs = mods;
                                res.human_objs = hums;
                                res.zombie_objs = zombs;

                                cb({ body: res });
                            });
                    });
            });
    });
};

module.exports = Create;
