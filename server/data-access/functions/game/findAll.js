const Promise = require("bluebird");

const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");
const clone = rootRequire("server/helpers/clone");

function FindAll() {
    return new Promise(function(resolve, reject) {
        Game.find({})
            .sort("startDate")
            .select("_id")
            .exec()
            .then(gameIds => {
                return Promise.map(clone(gameIds), gameId => {
                    return findById(gameId);
                });
            })
            .then(games => {
                resolve(games);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindAll;
