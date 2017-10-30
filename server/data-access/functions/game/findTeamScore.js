const Promise = require("bluebird");

const findById = rootRequire("server/data-access/functions/game/findById");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");

function FindTeamScore(gameId, team) {
    return new Promise(function(resolve, reject) {
        let game = null;
        if (team === "Moderator") {
            return resolve(Number.MAX_VALUE);
        } else if (team !== "Human" && team !== "Zombie") {
            return resolve(0);
        }
        findById(gameId)
            .then(gameObj => {
                game = gameObj;
                let userIds = team === "Human" ? game.humans : game.zombies;
                let promises = [];
                userIds.forEach(userId => {
                    promises.push(findUserScore(gameId, userId, true));
                });
                return Promise.all(promises);
            })
            .then(values => {
                resolve(values.reduce((sum, val) => sum + val, 0));
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindTeamScore;
