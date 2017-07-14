const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");
const sendUnsuppliedEmail = rootRequire("server/data-access/functions/message/sendUnsuppliedEmail");

function UnsuppliedDeath(gameId, cb) {
    Game.findOne({_id: gameId})
        .exec((err, game) => {
            if (err) {
                return cb({error: err});
            }
            if (!game) {
                return cb({error: "Game not found"});
            }
            if (!game.isStarted) {
                return cb({error: "Game has to be started"});
            }
            let starvingHumans = [];
            let count = 0;
            let errored = false;
            game.humans.forEach(human => {
                if (errored) {
                    return;
                }
                findUserScore(gameId, human, res => {
                    if (res.error) {
                        if (errored) {
                            return;
                        }
                        errored = true;
                        return cb(res);
                    }
                    let score = res.body;
                    if (score < game.suppliedValue) {
                        starvingHumans.push(human);
                    }
                    count++;
                    if (count !== game.humans.length) {
                        return;
                    }
                    User.find({_id: {$in: starvingHumans}})
                        .select("email playerName")
                        .exec((err, users) => {
                            if (err) {
                                return cb({error: err});
                            }
                            sendUnsuppliedEmail(users, (err, res) => {
                                if (err) {
                                    return cb({error: err});
                                }
                                Game.findOneAndUpdate({_id: gameId}, {
                                    $push: {
                                        zombies: {
                                            $all: starvingHumans
                                        }
                                    },
                                    $pullall: {
                                        humans: starvingHumans
                                    }
                                }, err => {
                                    if (err) {
                                        return cb({error: err});
                                    }
                                    cb({body: "There are no unsupplied humans left"})
                                });
                            });
                        });
                }, true);
            });
        });
}

module.exports = UnsuppliedDeath;
