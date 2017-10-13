const Promise = require("bluebird");

const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");

function Create(game) {
    return new Promise(function(resolve, reject) {
        game = new Game(game);
        game.save()
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

module.exports = Create;
