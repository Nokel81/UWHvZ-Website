const Promise = require('bluebird');

const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");

function Update(game, userId, isSuper) {
    return new Promise(function(resolve, reject) {
        let andQuery = [{moderator: game.moderators}];
        if (!isSuper) {
            andQuery.push({moderators: userId});
        }
        Game.update({
            _id: game._id,
            // The next fields to make these fields ReadOnly
            zombies: game.zombies,
            originalZombies: game.originalZombies,
            humans: game.humans,
            $and: andQuery,
            spectators: game.spectators,
        }, game)
        .exec()
        .then(game => {
            if (!game) {
                return reject("You do not have permission to edit that game");
            }
            return findById(game._id);
        })
        .then(game => {
            resolve(game);
        })
        .catch(error => {
            reject(error);
        })
    });
}

module.exports = Update;
