const Promise = require('bluebird');

const User = rootRequire('server/schemas/user');
const Settings = rootRequire('server/schemas/settings');
const mailService = rootRequire('server/services/mail');
const webmasterEmail = rootRequire('server/config.json').webmasterEmail;
const recipientCodes = rootRequire("server/constants.json").recipientCodes;
const findById = rootRequire("server/data-access/functions/game/findById");
const resolveFileData = rootRequire("server/data-access/functions/message/resolveFileData");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");

function SendMessage(message) {
    return new Promise(function(resolve, reject) {
        if (!message.to) {
            return reject("Missing the 'to' field");
        }
        if (!message.subject) {
            return reject("Missing the 'subject' field");
        }
        if (!message.body) {
            return reject("Missing the 'body' field");
        }
        let promise = null;
        if (message.to[0] === "#") {
            let gameId = message.to.slice(1);
            promise = new Promise(function(resolve, reject) {
                findById(gameId)
                .then(game => {
                    let recipients = game.humans.concat(game.moderators).concat(game.zombies).concat(game.spectators);
                    return User.find({_id: {$in: recipients}}).select("email").exec();
                })
                .then(recipients => {
                    resolve(recipients.map(user => user.email));
                })
                .catch(error => {
                    reject(error);
                })
            });
        } else if (Object.values(recipientCodes).indexOf(message.to) < 0) {
            promise = new Promise(function(resolve, reject) {
                resolve(message.to);
            });
        } else if (message.to === recipientCodes.toWebmaster) {
            promise = new Promise(function(resolve, reject) {
                resolve(webmasterEmail);
            });
        } else {
            promise = new Promise(function(resolve, reject) {
                let users = null;
                findCurrentOrNext()
                .then(game => {
                    let query = {};
                    if (message.to !== recipientCodes.toAllUsers) {
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
                        query._id = {$in: userIds};
                    }
                    return User.find({}).select("email _id").exec();
                })
                .then(userObjs => {
                    users = userObjs;
                    return Settings.find({userId: {$in: users.map(user => user._id)}}).exec();
                })
                .then(settings => {
                    resolve(users.filter(user => settings.find(group => group.userId.toString() === user._id.toString()).promotionalEmails).map(user => user.email));
                })
                .catch(error => {
                    reject(error);
                });
            });
        }
        promise
        .then(recipients => {
            message.to = recipients;
            return resolveFileData(message.fileData);
        })
        .then(fileData => {
            message.fileData = fileData;
            return mailService.sendMessage(message);
        })
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    });
}

module.exports = SendMessage;
