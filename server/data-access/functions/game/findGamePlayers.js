const User = rootRequire("server/schemas/user");
const Report = rootRequire("server/schemas/report");
const Settings = rootRequire("server/schemas/settings");
const findGameById = rootRequire("server/data-access/functions/game/findById");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");

function FindGamePlayers(gameId, userId, cb) {
    findGameById(gameId, res => {
        if (res.error) {
            return cb(res);
        }
        let game = res.body;
        let zombieCount = game.zombies.length
        Report.count({gameId: game._id, reportType: "Stun"})
            .exec((err, stunCount) => {
                if (err) {
                    return cb({error: err});
                }
                const players = game.humans.concat(game.zombies).concat(game.spectators);
                User.find({_id: {$in: players}})
                    .select("playerName _id")
                    .sort("playerName")
                    .exec((err, users) => {
                        if (err) {
                            return cb({error: err});
                        }
                        const gamePlayers = JSON.parse(JSON.stringify(users));
                        let count = 0;
                        let errored = false;
                        let isHumanKnowledge = game.humans.indexOf(userId) >= 0 || !userId || userId == "null" || userId == "undefined";
                        let isModerator = game.moderators.indexOf(userId) >= 0;
                        gamePlayers.forEach(user => {
                            if (errored) {
                                return;
                            }
                            Settings.findOne({userId: user._id})
                                .exec((err, settings) => {
                                    if (err) {
                                        if (errored) {
                                            return;
                                        }
                                        errored = true;
                                        return cb({error: err});
                                    }
                                    let end = function () {
                                        if (count !== gamePlayers.length) {
                                            return;
                                        }
                                        gamePlayers.forEach(user => {
                                            if (game.zombies.indexOf(user._id) >= 0) {
                                                user.team = isHumanKnowledge ? "Human" : "Zombie";
                                            } else if (game.spectators.indexOf(user._id) >= 0) {
                                                user.team = "Spectator";
                                            } else {
                                                user.team = "Human";
                                            }
                                            delete user._id;
                                        });
                                        User.find({_id: {$in: game.moderators}})
                                            .select(isHumanKnowledge ? "playerName" : "playerName email")
                                            .sort("playerName")
                                            .exec((err, gameMods) => {
                                                if (err) {
                                                    return cb({error: err});
                                                }
                                                cb({body: {gameMods, gamePlayers, zombieCount, stunCount}});
                                            });
                                    };
                                    if (settings.showScore || isModerator) {
                                        findUserScore(gameId, user._id, res => {
                                            if (res.error) {
                                                if (errored) {
                                                    return;
                                                }
                                                errored = true;
                                                return cb(res);
                                            }
                                            user.score = res.body;
                                            count++;
                                            end();
                                        }, true);
                                    } else {
                                        user.score = "HIDDEN";
                                        count++;
                                        end();
                                    }
                                });
                        });
                    });
            });
    });
}

module.exports = FindGamePlayers;
