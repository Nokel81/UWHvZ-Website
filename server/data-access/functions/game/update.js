const Promise = require('bluebird');

const Game = rootRequire("server/schemas/game");
const findGameById = rootRequire("server/data-access/functions/game/findById");

function Update(game) {
    return new Promise(function(resolve, reject) {
        Game.findOneAndUpdate({_id: game._id}, game)
        .exec()
        .then(game => {
            return findGameById(game._id);
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
