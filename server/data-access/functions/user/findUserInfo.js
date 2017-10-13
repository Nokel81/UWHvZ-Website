const Promise = require("bluebird");

const findUserType = rootRequire("server/data-access/functions/user/findUserType");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const findTeamScore = rootRequire("server/data-access/functions/game/findTeamScore");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");

function FindUserInfo(userId) {
    return new Promise(function(resolve, reject) {
        let game = null;
        findCurrentOrNext()
            .then(gameObj => {
                game = gameObj;
                if (game.startDate >= new Date().toISOString()) {
                    return reject("Game has not started yet");
                }
                return findUserType(userId, game);
            })
            .then(userType => {
                return Promise.join(findUserScore(game._id, userId), findTeamScore(game._id, userType), (userScore, teamScore) => {
                    resolve({
                        userScore,
                        teamScore,
                        userType
                    });
                });
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindUserInfo;
