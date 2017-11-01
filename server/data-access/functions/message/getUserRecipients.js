const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");
const findAll = rootRequire("server/data-access/functions/game/findAll");
const recipientCodes = rootRequire("server/constants.json").recipientCodes;
const levels = rootRequire("server/constants.json").securityNames;
const webmasterEmail = rootRequire("server/config.json").webmasterEmail;

function GetUserRecipients(userId, userType, isSuper) {
    return new Promise(function(resolve, reject) {
        let userObjs = null;
        let recipients = [{
            title: "Webmaster",
            value: recipientCodes.toWebmaster
        }];
        User.find({
            email: {
                $ne: webmasterEmail
            }
        })
            .select("email playerName")
            .sort("playerName")
            .exec()
            .then(users => {
                userObjs = users;
                return findAll();
            })
            .then(games => {
                let hasCurrentGame = false;

                if (games.length === 0) {
                    return resolve(recipients);
                }
                if (new Date(games[games.length - 1].endDate) >= new Date()) {
                    hasCurrentGame = true;
                    recipients.push({
                        title: "Moderators",
                        value: recipientCodes.toModerators
                    });
                }
                if ([levels.nonplayer, levels.spectator].includes(userType) && !isSuper) {
                    return resolve(recipients);
                }
                if (isSuper) {
                    for (;;) {
                        games.forEach(game => {
                            recipients.push({
                                title: game.name + " - All Participents",
                                value: "#" + game._id
                            });
                        });
                        if (hasCurrentGame) {
                            break;
                        }
                        userObjs.forEach(user => {
                            if (user.confirmationToken) {
                                return;
                            }
                            recipients.push({
                                title: user.playerName,
                                value: user.email
                            });
                        });
                        return resolve(recipients);
                    }
                }
                if (!hasCurrentGame) {
                    return resolve(recipients);
                }
                recipients.push({
                    title: "All Players",
                    value: recipientCodes.toAllPlayers
                });
                if (userType === levels.human) {
                    return resolve(recipients);
                }
                recipients.push({
                    title: "Zombies",
                    value: recipientCodes.toZombies
                });
                if (userType === levels.zombie) {
                    return resolve(recipients);
                }
                recipients.push({
                    title: "Humans",
                    value: recipientCodes.toHumans
                });
                recipients.push({
                    title: "All Users",
                    value: recipientCodes.toAllUsers
                });
                userObjs.forEach(user => {
                    if (user.confirmationToken) {
                        return;
                    }
                    recipients.push({
                        title: user.playerName,
                        value: user.email
                    });
                });
                resolve(recipients);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = GetUserRecipients;
