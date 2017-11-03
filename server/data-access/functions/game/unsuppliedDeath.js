const Promise = require("bluebird");

const Game = rootRequire("server/schemas/game");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");
const findGameById = rootRequire("server/data-access/functions/game/findById");
const findUserById = rootRequire("server/data-access/functions/user/findById");
const sendUnsuppliedEmail = rootRequire("server/data-access/functions/message/sendUnsuppliedEmail");

function UnsuppliedDeath(gameId) {
    return new Promise(function(resolve, reject) {
        let starvingHumans = [];
        let game;
        findGameById(gameId)
            .then(gameObj => {
                game = gameObj;
                if (new Date() < game.startDate) {
                    return reject("Game has to be started");
                }
                starvingHumans = game.humans;
                let points = [];
                starvingHumans.forEach(user => {
                    points.push(new Promise(function(resolve, reject) {
                        findUserScore(gameId, user, true, game)
                            .then(score => {
                                resolve({
                                    userId: user,
                                    score
                                });
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }));
                });
                return Promise.all(points);
            })
            .then(scores => {
                scores = scores.filter(score => score.score < game.suppliedValue);
                starvingHumans = scores.map(score => score.userId);

                let emails = [];
                starvingHumans.forEach(user => {
                    emails.push(new Promise(function(resolve, reject) {
                        findUserById(user)
                            .then(userObj => {
                                resolve(userObj.email);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }));
                });
                return Promise.all(emails);
            })
            .then(emails => {
                return sendUnsuppliedEmail(emails, game.suppliedValue);
            })
            .then(() => {
                return Game.updateOne({
                    _id: gameId
                }, {
                    $push: {
                        zombies: {
                            $each: starvingHumans
                        },
                        starvedZombies: {
                            $each: starvingHumans
                        }
                    },
                    $pullAll: {
                        humans: starvingHumans
                    }
                });
            })
            .then(() => {
                resolve("There are no unsupplied humans left");
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = UnsuppliedDeath;
