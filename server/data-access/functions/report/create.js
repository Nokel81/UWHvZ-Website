const Promise = require("bluebird");

const Report = rootRequire("server/schemas/report");
const Game = rootRequire("server/schemas/game");
const mailService = rootRequire("server/services/mail");
const findUserType = rootRequire("server/data-access/functions/user/findUserType");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const findByPlayerCode = rootRequire("server/data-access/functions/user/findByPlayerCode");
const findById = rootRequire("server/data-access/functions/user/findById");

function Create(report) {
    return new Promise(function(resolve, reject) {
        let taggerType = null;
        let taggedType = null;
        let tagger = null;
        let tagged = null;
        let word = null;
        let gameObj;
        findCurrentOrNext()
            .then(game => {
                gameObj = game;
                if (game.startDate >= new Date().toISOString()) {
                    return reject("Game has not started yet");
                }
                if (report.time < game.startDate) {
                    return reject("You cannot play before the game has begun");
                }
                if (report.time > game.endDate) {
                    return reject("You cannot play after the game has ended");
                }
                return Promise.join(findById(report.tagger), findByPlayerCode(report.taggedCode), (taggerObj, taggedObj) => {
                    tagger = taggerObj;
                    tagged = taggedObj;
                    return Promise.join(findUserType(tagger._id, game), findUserType(tagged._id, game))
                        .then(([taggerType, taggedType]) => {

                            if (taggedType !== "Human" && taggedType !== "Zombie") {
                                return reject("You have to tag either a Human or a Zombie");
                            }
                            if (taggerType === "Zombie") {
                                if (taggedType === "Zombie") {
                                    return new Promise(function(resolve, reject) {
                                        Report.findOne({
                                            tagged: taggedObj._id,
                                            type: "Tag"
                                        })
                                            .exec()
                                            .then(() => {
                                                reject("Zombies cannot tag other zombies");
                                            })
                                            .catch(() => {
                                                if (gameObj.originalZombies.find(x => x.toString() === taggedObj._id.toString())) {
                                                    return reject("Zombies cannot tag original zombies");
                                                }
                                                if (gameObj.starvedZombies.find(x => x.toString() === taggedObj._id.toString())) {
                                                    return reject("Zombies cannot tag starved zombies");
                                                }
                                                resolve("Tag");
                                            });
                                    });
                                } else {
                                    return Promise.resolve("Tag");
                                }
                            } else {
                                if (taggedType === "Zombie") {
                                    return Promise.resolve("Stun");
                                } else {
                                    return new Promise(function(resolve, reject) {
                                        Report.count({
                                            tagged: tagged._id,
                                            reportType: "Tag"
                                        })
                                        .exec()
                                        .then(count => {
                                            if (count > 0) {
                                                reject("You cannot tag someone who has already been tagged");
                                            } else {
                                                resolve("Tag");
                                            }
                                        })
                                        .catch(error => {
                                            reject(error);
                                        });
                                    });
                                }
                            }
                        });
                });
            })
            .then(type => {
                report.tagged = tagged._id;
                report.gameId = gameObj._id;
                report.reportType = type;
                report = new Report(report);
                word = report.reportType.toLowerCase();
                word += word[word.length - 1];
                return report.validate();
            })
            .then(() => {
                let newZombies = [];
                if (report.reportType === "Tag") {
                    newZombies.push(tagged._id);
                    if (taggerType === "Human") {
                        newZombies.push(tagger._id);
                    }
                }
                return Game.updateOne({
                    _id: gameObj._id
                }, {
                    $push: {
                        zombies: {
                            $each: newZombies
                        }
                    },
                    $pullAll: {
                        humans: newZombies
                    }
                })
                    .exec();
            })
            .then(() => {
                return mailService.sendTaggedEmail(tagged.email, tagged.playerName, tagger.playerName, report);
            })
            .then(() => {
                if (taggerType === taggedType && taggerType === "Human") {
                    return mailService.sendTaggerEmail(tagger.email, tagged.playerName, report);
                } else {
                    return Promise.resolve();
                }
            })
            .then(() => {
                return report.save();
            })
            .then(() => {
                resolve("You " + word + "ed " + tagged.playerName);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Create;
