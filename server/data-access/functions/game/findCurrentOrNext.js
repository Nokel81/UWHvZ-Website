const Promise = require('bluebird');

const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");

function FindCurrentOrNext() {
    return new Promise(function(resolve, reject) {
        Game.findOne({endDate: {$gte: new Date()}})
        .sort({endDate: -1})
        .exec()
        .then(game => {
            return findById(game._id);
        })
        .then(game => {
            resolve(game);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = FindCurrentOrNext;
