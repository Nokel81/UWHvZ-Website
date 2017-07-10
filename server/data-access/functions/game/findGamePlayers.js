const findGameById = rootRequire("server/data-access/functions/game/findById");
const User = rootRequire("server/schemas/user");

function FindGamePlayers(gameId, userId, cb) {
    findGameById(gameId, res => {
        if (res.error) {
            return cb(res);
        }
        let game = res.body;
        if (game.humans.indexOf(userId) >= 0 || !userId || userId == "null") {
            const players = game.humans.concat(game.zombies).concat(game.spectators);
            User.find({_id: {$in: players}})
                .select("playerName _id")
                .sort("playerName")
                .exec((err, users) => {
                    if (err) {
                        return cb({error: err});
                    }
                    const gamePlayers = JSON.parse(JSON.stringify(users));
                    gamePlayers.forEach(user => {
                        user.team = "Human";
                        if (game.spectators.indexOf(user._id.toString()) >= 0) {
                            user.team = "Spectator";
                        }
                        delete user._id;
                    });

                    User.find({_id: {$in: game.moderators}})
                        .select("playerName")
                        .sort("playerName")
                        .exec((err, gameMods) => {
                            if (err) {
                                return cb({error: err});
                            }
                            cb({body: {gameMods, gamePlayers}});
                        });
                });
        } else {
            const players = game.humans.concat(game.zombies).concat(game.spectators);
            User.find({_id: {$in: players}})
                .select("_id playerName")
                .sort("playerName")
                .exec((err, users) => {
                    if (err) {
                        return cb({error: err});
                    }
                    const gamePlayers = JSON.parse(JSON.stringify(users));
                    gamePlayers.forEach(user => {
                        if (game.zombies.indexOf(user._id) >= 0) {
                            user.team = "Zombie";
                        } else if (game.spectators.indexOf(user._id) >= 0) {
                            user.team = "Spectator";
                        } else {
                            user.team = "Human";
                        }
                        delete user._id;
                    });
                    User.find({_id: {$in: game.moderators}})
                        .select("playerName email")
                        .sort("playerName")
                        .exec((err, gameMods) => {
                            if (err) {
                                return cb({error: err});
                            }
                            cb({body: {gameMods, gamePlayers}});
                        });
                });
        }
    });
}

module.exports = FindGamePlayers;
