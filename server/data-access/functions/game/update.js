const Promise = require('bluebird');

const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");

function Update(game) {
    return new Promise(function(resolve, reject) {
        Game.updateOne({_id: game._id}, game)
        .exec()
        .then(game => {
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
