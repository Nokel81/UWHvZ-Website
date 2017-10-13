const Promise = require("bluebird");

const findById = rootRequire("server/data-access/functions/game/findById");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");
const clone = rootRequire("server/helpers/clone");

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
                return Promise.reduce(clone(userIds), userId => {
                    return findUserScore(gameId, userId, true);
                }, 0);
            })
            .then(teamScore => {
                resolve(teamScore);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindTeamScore;
