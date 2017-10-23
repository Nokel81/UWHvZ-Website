const Promise = require("bluebird");

const Game = rootRequire("server/schemas/game");
const findAll = rootRequire("server/data-access/functions/game/findAll");
const findByCode = rootRequire("server/data-access/functions/user/findByPlayerCode");
const findById = rootRequire("server/data-access/functions/user/findById");

function ModifyPlayerListOfGame(gameId, userCode, team, method, userId) {
    return new Promise(function(resolve, reject) {
        let promise;
        if (userCode) {
            promise = findByCode(userCode);
        } else if (userId) {
            promise = findById(userId);
        } else {
            return reject("Invalid Call");
        }
        promise
            .then(user => {
                team += "s";
                if (["spectators", "moderators", "humans", "zombies"].indexOf(team) < 0) {
                    return reject("Invalid team name");
                }

                let updateQuery = {
                    [method]: {
                        [team]: user._id
                    }
                };
                return Game.updateOne({
                    _id: gameId
                }, updateQuery);
            })
            .then(() => {
                return findAll();
            })
            .then(games => {
                resolve(games);
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = ModifyPlayerListOfGame;
