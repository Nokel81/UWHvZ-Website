const Promise = require("bluebird");

const Settings = rootRequire("server/schemas/settings");
const findGameById = rootRequire("server/data-access/functions/game/findById");
const findUserType = rootRequire("server/data-access/functions/user/findUserType");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");
const levels = rootRequire("server/constants.json").securityNames;

function FindGamePlayers(gameId, userId, userType, isSuper) {
    return new Promise(function(resolve, reject) {
        let isLevelIndigo = [levels.spectator, levels.moderator].includes(userType) || isSuper;
        let isLevelBlue = [levels.spectator, levels.moderator, levels.zombie].includes(userType) || isSuper;
        let isLevelGreen = [levels.spectator, levels.moderator, levels.zombie, levels.human].includes(userType) || isSuper;
        let players = [];
        let playerObjs = [];
        let game = null;
        findGameById(gameId)
            .then(gameObj => {
                game = gameObj;
                players = game.humans.concat(game.zombies).concat(game.spectators);
                playerObjs = game.humanObjs.concat(game.zombieObjs).concat(game.spectatorObjs);
                let scores = [];
                players.forEach(player => {
                    scores.push(new Promise(function(resolve, reject) {
                        let userScore;
                        console.log(player);
                        findUserScore(gameId, player, true)
                            .then(score => {
                                userScore = score;
                                return Settings.findOne({
                                    userId: player
                                }).exec();
                            })
                            .then(settings => {
                                if (!settings.showScore && !isLevelIndigo) {
                                    userScore = "HIDDEN";
                                }
                                return findUserType(player, game);
                            })
                            .then(playerType => {
                                let user = playerObjs.find(p => p._id.toString() === player.toString());
                                if (!isLevelBlue && playerType === levels.zombie) {
                                    playerType = levels.human;
                                }
                                resolve({
                                    playerName: user.playerName,
                                    team: playerType,
                                    score: userScore
                                });
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }));
                });
                return Promise.all(scores);
            })
            .then(scores => {
                scores = scores.sort((a, b) => {
                    if (a.playerName < b.playerName) {
                        return -1;
                    }
                    if (a.playerName > b.playerName) {
                        return 1;
                    }
                    return 0;
                });
                let mods = game.moderatorObjs.map(mod => {
                    let res = {
                        playerName: mod.playerName
                    };
                    if (isLevelGreen) {
                        res.email = mod.email;
                    }
                    return res;
                });
                resolve({
                    gameMods: mods,
                    gamePlayers: scores
                });
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindGamePlayers;
