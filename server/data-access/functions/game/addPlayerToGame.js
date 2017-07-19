const Promise = require('bluebird');

const Game = rootRequire("server/schemas/game");
const getUserByPlayerCode = rootRequire("server/data-access/functions/user/getUserByPlayerCode");
const findAll = rootRequire("server/data-access/functions/game/findAll");

function AddPlayerToGame(newPlayer) {
    return new Promise(function(resolve, reject) {
        newPlayer.team += "s";
        if (["spectators", "moderators", "humans", "zombies"].indexOf(newPlayer.team) < 0) {
            reject("Invalid team name");
            return;
        }
        getUserByPlayerCode(newPlayer.playerCode)
            .then(player => {
                let updateQuery = {$push: {}};
                updateQuery.$push[newPlayer.team] = user._id;
                return Game.findOneAndUpdate({_id: newPlayer.gameId}, updateQuery).exec();
            })
            then(game => {
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
