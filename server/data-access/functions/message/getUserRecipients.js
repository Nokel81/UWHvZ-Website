const Promise = require('bluebird');

const User = rootRequire("server/schemas/user");
const findAll = rootRequire("server/data-access/functions/game/findAll");
const findUserType = rootRequire("server/data-access/functions/user/findUserType");
const findUserById = rootRequire("server/data-access/functions/user/findById");
const recipientCodes = rootRequire("server/constants.json").recipientCodes;
const webmasterEmail = rootRequire('server/config.json').webmasterEmail;

function GetUserRecipients(userId) {
    return new Promise(function(resolve, reject) {
        let user = null;
        let userType = null;
        let recipients = [{
            title: "Webmaster",
            value: recipientCodes.toWebmaster
        }];
        findUserById(userId)
        .then(userObj => {
            user = userObj;
            return findUserType(userId);
        })
        .then(type => {
            userType = type;
            return findAll();
        })
        .then(games => {
            let hasCurrentGame = false;
            const isSuper = user.email === webmasterEmail;

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
            if (userType === "NonPlayer" || userType === "Spectator") {
                return resolve(recipients);
            }
            if (isSuper) {
                games.forEach(game => {
                    recipients.push({
                        title: game.name + " - All Participents",
                        value: "#" + game._id
                    });
                });
            }
            if (!hasCurrentGame) {
                return resolve(recipients);
            }
            recipients.push({
                title: "All Players",
                value: recipientCodes.toAllPlayers
            });
            if (userType === "Human") {
                return resolve(recipients);
            }
            recipients.push({
                title: "Zombies",
                value: recipientCodes.toZombies
            });
            if (userType === "Zombie") {
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
            return User.find({email: {$ne: webmasterEmail}}).select("email playerName").sort("playerName").exec();
        })
        .then(users => {
            users.forEach(user => {
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
