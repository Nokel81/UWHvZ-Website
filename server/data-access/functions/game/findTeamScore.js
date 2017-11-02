const Promise = require("bluebird");

const findById = rootRequire("server/data-access/functions/game/findById");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");
const levels = rootRequire("server/constants.json").securityNames;

function FindTeamScore(gameId, team) {
    return new Promise(function(resolve, reject) {
        let game = null;
        if (team === levels.moderator) {
            return resolve(Number.MAX_VALUE);
        } else if (![levels.human, levels.zombie].includes(team)) {
            return resolve(0);
        }
        findById(gameId)
            .then(gameObj => {
                game = gameObj;
                let userIds = team === levels.human ? game.humans : game.zombies;
                let promises = [];
                userIds.forEach(userId => {
                    promises.push(findUserScore(gameId, userId, true, game));
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
