const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");

function Update (game, cb) {
    Game.findOneAndUpdate({ _id: game._id }, game, { new: true })
        .exec((err, game) => {
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
                                    console.log(res);
                                    cb({ body: res });
                                });
                        });
                });
        });
};

module.exports = Update;
