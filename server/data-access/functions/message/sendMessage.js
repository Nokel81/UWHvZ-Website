const recipientCodes = rootRequire("server/constants.json").recipientCodes;
const mailService = rootRequire('server/services/mail');
const User = rootRequire('server/schemas/user');
const Settings = rootRequire('server/schemas/settings');
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const findById = rootRequire("server/data-access/functions/game/findById");

function SendMessage(message, cb) {
    if (!Array.isArray(message.fileData)) {
        message.fileData = [];
    }
    if (!message.to) {
        return cb({error: "Missing the 'to' field"});
    }
    if (!message.subject) {
        return cb({error: "Missing the 'subject' field"});
    }
    if (!message.body) {
        return cb({error: "Missing the 'body' field"});
    }
    let validRecipientCodes = Object.keys(recipientCodes).map(recipientCode => recipientCodes[recipientCode]);
    if (message.to[0] === "#") {
        let gameId = message.to.slice(1);
        findById(gameId, res => {
            if (res.error) {
                return cb(res);
            }
            let game = res.body;
            let recipients = game.humans.concat(game.moderators).concat(game.zombies).concat(game.spectators);
            User.find({_id: {$in: recipients}})
                .select("email")
                .exec((err, users) => {
                    if (err) {
                        return cb({error: err});
                    }
                    message.to = users.map(user => user.email);
                    mailService.sendMessage(message, (err, body) => {
                        if (err) {
                            return cb({error: err});
                        }
                        cb({body});
                    });
                });
        });
    } else if (validRecipientCodes.indexOf(message.to) < 0) {
        User.findOne({_id: message.to})
            .select("email")
            .exec((err, user) => {
                if (err) {
                    return cb({error: err});
                }
                if (!user) {
                    return cb({error: "Recipient not found"});
                }
                message.to = user.email;
                mailService.sendMessage(message, (err, body) => {
                    if (err) {
                        return cb({error: err});
                    }
                    cb({body});
                });
            });
    } else if (message.to === recipientCodes.toAllUsers) {
        User.find({})
            .select("email _id")
            .exec((err, users) => {
                if (err) {
                    return cb({error: err});
                }
                let ids = users.map(user => user._id);
                Settings.find({userId: {$in: ids}})
                    .exec((err, settings) => {
                        if (err) {
                            return cb({error: err});
                        }
                        let emails = users.filter(user => settings.find(group => group.userId.toString() === user._id.toString()).promotionalEmails).map(user => user.email);
                        message.to = emails;
                        mailService.sendMessage(message, (err, body) => {
                            if (err) {
                                return cb({error: err});
                            }
                            cb({body});
                        });
                    });
            });
    } else if (message.to === recipientCodes.toWebmaster) {
        message.to = "webmaster.uwhvz@gmail.com";
        mailService.sendMessage(message, (err, res) => {
            if (err) {
                return cb({error: res});
            }
            cb({body: res});
        });
    } else {
        findCurrentOrNext(res => {
            if (res.error) {
                return cb(res);
            }
            if (!res.body) {
                return cb({error: "No game to send messages within"});
            }
            const game = res.body;
            let userIds = game.moderators;
            if (message.to !== recipientCodes.toModerators) {
                userIds = userIds.concat(game.spectators);
            }
            if (message.to === recipientCodes.toAllPlayers || message.to === recipientCodes.toHumans) {
                userIds = userIds.concat(game.humans);
            }
            if (message.to === recipientCodes.toAllPlayers || message.to === recipientCodes.toZombies) {
                userIds = userIds.concat(game.zombies);
            }

            Settings.find({userId: {$in: userIds}})
                .exec((err, settings) => {
                    if (err) {
                        return cb({error: err});
                    }
                    let validUserIds = settings.filter(group => group.gameEmails).map(group => group.userId);
                    User.find({_id: {$in: validUserIds}})
                        .select("email")
                        .exec((err, users) => {
                            if (err) {
                                return cb({error: err});
                            }
                            let emails = users.map(user => user.email);
                            message.to = emails;
                            mailService.sendMessage(message, (err, body) => {
                                if (err) {
                                    return cb({error: err});
                                }
                                cb({body});
                            });
                        });
                });
        });
    }
}

module.exports = SendMessage;
