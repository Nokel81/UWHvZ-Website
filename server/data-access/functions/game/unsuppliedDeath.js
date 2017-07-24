const Promise = require('bluebird');

const Game = rootRequire("server/schemas/game");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");
const findGameById = rootRequire("server/data-access/functions/game/findById");
const findUserById = rootRequire("server/data-access/functions/user/findById");
const sendUnsuppliedEmail = rootRequire("server/data-access/functions/message/sendUnsuppliedEmail");

function UnsuppliedDeath(gameId) {
    return new Promise(function(resolve, reject) {
        let starvingHumans = [];
        findGameById(gameId)
        .then(game => {
            if (!game.started) {
                return reject("Game has to be started");
            }
            starvingHumans = game.humans;
            return Promise.each(game.humans, humanId => {
                return new Promise(function(resolve, reject) {
                    findUserScore(gameId, humanId, true)
                    .then(score => {
                        if (score >= game.suppliedValue) {
                            resolve();
                        } else {
                            return findUserById(humanId);
                        }
                    })
                    .then(user => {
                        sendUnsuppliedEmail(users, game.suppliedValue);
                    })
                    .then(noerror => {
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
                });
            });
        })
        .then(noerror => {
            return Game.updateOne({_id: gameId}, {
                $push: {
                    zombies: {
                        $each: starvingHumans
                    }
                },
                $pullAll: {
                    humans: starvingHumans
                }
            });
        })
        .then(noerror => {
            resolve("There are no unsupplied humans left");
        })
        .catch(error => {
            reject(error);
        })
    });
}

module.exports = UnsuppliedDeath;
