const Promise = require('bluebird');

const Game = rootRequire("server/schemas/game");
const findAll = rootRequire("server/data-access/functions/game/findAll");

function AddPlayerToGame(oldPlayer) {
    return new Promise(function(resolve, reject) {
        oldPlayer.team += "s";
        if (["spectators", "moderators", "humans", "zombies"].indexOf(oldPlayer.team) < 0) {
            return reject("Invalid team name");
        }
        let updateQuery = {$pull: {}};
        updateQuery.$pull[oldPlayer.team] = oldPlayer.playerId;
        Game.updateOne({_id: oldPlayer.gameId}, updateQuery)
        .then(game => {
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

module.exports = AddPlayerToGame;
