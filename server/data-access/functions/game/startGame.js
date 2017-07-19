const Promise = require('bluebird');
const fs = require("fs");

const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");
const GameSignUp = rootRequire("server/schemas/gameSignUp");
const sendStartingEmail = rootRequire("server/data-access/functions/message/sendStartingEmail");

function StartGame(OZemails, gameId, HTMLlore, fileData) {
    Game.findOne({_id: gameId})
        .exec((err, game) => {
            if (err) {
                return cb({error: err});
            }
            if (!game) {
                return cb({error: "Game not found"});
            }
            if (game.isStarted) {
                return cb({error: "Game has already been started"});
            }
            GameSignUp.find({gameId})
                .exec((err, signups) => {
                    if (err) {
                        return cb({error: err});
                    }

                    const spectatorEmails = signups.filter(signup => signup.teamPreference === "Spectator").map(signup => signup.userEmail);
                    const humanEmails = signups.filter(signup => signup.teamPreference === "Human" || (OZemails.indexOf(signup.userEmail) < 0 && signup.teamPreference === "Zombie")).map(signup => signup.userEmail);
                    const zombieEmails = OZemails;
                    const emails = signups.map(signup => signup.userEmail);

                    User.find({email: {$in: emails}})
                        .select("email _id")
                        .exec((err, users) => {
                            if (err) {
                                return cb({error: err});
                            }
                            const spectatorIds = users.filter(user => spectatorEmails.indexOf(user.email) >= 0).map(user => user._id);
                            const humanIds = users.filter(user => humanEmails.indexOf(user.email) >= 0).map(user => user._id);
                            const zombieIds = users.filter(user => zombieEmails.indexOf(user.email) >= 0).map(user => user._id);
                            game.originalZombies = zombieIds;
                            game.zombies = zombieIds;
                            game.spectators = spectatorIds;
                            game.humans = humanIds;
                            game.isStarted = true;
                            sendStartingEmail(spectatorEmails, "Spectator", game, HTMLlore, fileData, (err) => {
                                if (err) {
                                    return cb({error: err});
                                }
                                sendStartingEmail(humanEmails, "Human", game, HTMLlore, fileData, (err) => {
                                    if (err) {
                                        return cb({error: err});
                                    }
                                    sendStartingEmail(zombieEmails, "Zombie", game, HTMLlore, fileData, (err) => {
                                        if (err) {
                                            return cb({error: err});
                                        }
                                        game.save((err, game) => {
                                            if (err) {
                                                return cb({error: err});
                                            }
                                            fileData.forEach(fileData => {
                                                fs.unlink(fileData.path);
                                            });
                                            return cb({body: "Game has been started"});
                                        });
                                    });
                                });
                            });
                        });
                });
        });
}

module.exports = StartGame;
