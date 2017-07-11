const Report = rootRequire("server/schemas/report");
const Game = rootRequire("server/schemas/game");
const mailService = rootRequire("server/services/mail");
const getUserType = rootRequire("server/data-access/functions/user/getUserType");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const getUserByPlayerCode = rootRequire("server/data-access/functions/user/getUserByPlayerCode");
const getUserById = rootRequire("server/data-access/functions/user/getUserById");

function Create(report, cb) {
    findCurrentOrNext(res => {
        if (res.error) {
            return cb(res);
        }
        let game = res.body;
        if (game.startDate >= new Date().toISOString()) {
            return cb({error: "Game has not started yet"});
        }
        if (game.endDate < new Date().toISOString()) {
            return cb({error: "Game has ended"});
        }
        if (report.time < game.startDate) {
            return cb({error: "You cannot play before the game has begun"});
        }
        if (report.time > game.endDate) {
            return cb({error: "You cannot play after the game has ended"});
        }
        getUserById(report.tagger, res => {
            if (res.error) {
                return cb(res);
            }
            let tagger = res.body;
            getUserType(report.tagger, taggerRes => {
                if (taggerRes.error) {
                    return cb(res);
                }
                let taggerType = taggerRes.body;
                if (taggerType !== "Human" && taggerType !== "Zombie") {
                    return cb({error: "You have to be either a Human or a Zombie"});
                }
                getUserByPlayerCode(report.taggedCode, res => {
                    if (res.error) {
                        return cb(res);
                    }
                    let tagged = res.body;
                    getUserType(tagged._id, taggedRes => {
                        if (taggerRes.error) {
                            return cb(res);
                        }
                        let taggedType = taggedRes.body;
                        if (taggedType !== "Human" && taggedType !== "Zombie") {
                            return cb({error: "You have to tag either a Human or a Zombie"});
                        }
                        if (taggedType === taggerType && taggerType === "Zombie") {
                            return cb({error: "You have to tag someone who is on the other team"});
                        }
                        report.reportType = taggedType === "Human" ? "Tag" : "Stun";
                        report.tagged = tagged._id;
                        report.gameId = game._id;
                        let newReport = new Report(report);
                        newReport.validate(err => {
                            if (err) {
                                return cb({error: err});
                            }
                            newReport.save((err, report) => {
                                if (err) {
                                    return cb({error: err});
                                }
                                let newZombies = [];
                                if (report.reportType === "Tag") {
                                    newZombies.push(tagged._id);
                                    if (taggerType === "Human") {
                                        newZombies.push(tagger._id);
                                    }
                                }
                                Game.findOneAndUpdate({_id: game._id}, {
                                    $push: {
                                        zombies: {
                                            $each: newZombies
                                        }
                                    },
                                    $pullAll: {
                                        humans: newZombies
                                    }
                                }, err => {
                                    if (err) {
                                        return cb({error: err});
                                    }
                                    mailService.sendTaggedEmail(tagged.email, tagged.playerName, tagger.playerName, report, err => {
                                        if (err) {
                                            return cb({error: err});
                                        }
                                        let word = report.reportType.toLowerCase();
                                        word += word[word.length - 1];
                                        if (taggerType === "Human" && taggedType === "Human") {
                                            mailService.sendTaggerEmail(tagger.email, tagged.playerName, report, err => {
                                                if (err) {
                                                    return cb({error: err});
                                                }
                                                cb({body: "You " + word + "ed " + tagged.playerName});
                                            });
                                        } else {
                                            cb({body: "You " + word + "ed " + tagged.playerName});
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = Create;
