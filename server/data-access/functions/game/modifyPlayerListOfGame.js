const Promise = require("bluebird");

const Game = rootRequire("server/schemas/game");
const findAll = rootRequire("server/data-access/functions/game/findAll");

function ModifyPlayerListOfGame(gameId, userId, team, method) {
    return new Promise(function(resolve, reject) {
        team += "s";
        if (["spectators", "moderators", "humans", "zombies"].indexOf(team) < 0) {
            return reject("Invalid team name");
        }

        let updateQuery = {
            [method]: {
                [team]: userId
            }
        };
        Game.updateOne({
            _id: gameId
        }, updateQuery)
            .then(() => {
                return findAll();
            })
            .then(games => {
                resolve(games);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = ModifyPlayerListOfGame;
