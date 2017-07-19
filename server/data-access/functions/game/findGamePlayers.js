const Promise = require('bluebird');

const User = rootRequire("server/schemas/user");
const Report = rootRequire("server/schemas/report");
const Settings = rootRequire("server/schemas/settings");
const findGameById = rootRequire("server/data-access/functions/game/findById");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");
const clone = rootRequire("server/helpers/clone");

function FindGamePlayers(gameId, userId) {
    userId = userId == "null" || userId == "undefined" ? null : userId;
    return new Promise(function(resolve, reject) {
        let zombieCount = 0;
        let stunCount = 0;
        let players = [];
        let isModerator = false;
        let isHuman = false;
        let game = null;
        let gamePlayers = [];
        findGameById(gameId)
        .then(gameObj => {
            game = gameObj;
            zombieCount = game.zombies.length;
            players = game.humans.concat(game.zombies).concat(game.spectators);
            isModerator = game.moderators.indexOf(userId.toString()) >= 0;
            isHuman = game.humans.indexOf(userId.toString()) >= 0;
            return Report.count({gameId, reportType: "Stun"}).exec();
        })
        .then(count => {
            stunCount = count;
            return User.find({_id: {$in: players}}).select("playerName _id").sort("playerName").exec();
        })
        .then(users => {
            return Promise.map(clone(users), user => {
                return new Promise(function(resolve, reject) {
                    Settings.findOne({userId: user._id})
                    .exec()
                    .then(settings => {
                        if (!settings.showScore && !isModerator) {
                            user.score = "HIDDEN";
                            resolve(user);
                        } else {
                            return findUserScore(gameId, user._id, true);
                        }
                    })
                    .then(score => {
                        user.score = score;
                        resolve(user);
                    })
                    .catch(error => {
                        reject(error);
                    });
                });
            });
        })
        .then(users => {
            users.forEach(user => {
                if (game.zombies.indexOf(user._id.toString()) >= 0) {
                    user.team = isHuman ? "Human" : "Zombie";
                } else if (game.spectators.indexOf(user._id.toString()) >= 0) {
                    user.team = "Spectator";
                } else {
                    user.team = "Human";
                }
                delete user._id;
            });
            gamePlayers = users;
            return User.find({_id: {$in: game.moderators}}).select(userId ? "playerName email" : "playerName").sort("playerName").exec();
        })
        .then(gameMods => {
            resolve({gameMods, gamePlayers, zombieCount, stunCount});
        })
        .catch(error => {
            reject(error);
        })
    });
}

module.exports = FindGamePlayers;
