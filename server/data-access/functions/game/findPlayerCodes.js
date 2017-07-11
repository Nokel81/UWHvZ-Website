const User = rootRequire("server/schemas/user");
const Settings = rootRequire("server/schemas/settings");
const findGameById = rootRequire("server/data-access/functions/game/findById");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");

function FindGamePlayers(gameId, userId, cb) {
    findGameById(gameId, res => {
        if (res.error) {
            return cb(res);
        }
        let game = res.body;
        if (game.moderators.indexOf(userId) >= 0) {
            User.find({})
                .sort("playerName")
                .select("playerName playerCode")
                .exec((err, users) => {
                    if (err) {
                        return cb({error: err});
                    }
                    return cb({body: users});
                });
        } else {
            cb({error: "You are not a moderator"});
        }
    });
}

module.exports = FindGamePlayers;
