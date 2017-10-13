const Promise = require("bluebird");

const Game = rootRequire("server/schemas/game");

function Delete(id) {
    return new Promise(function(resolve, reject) {
        Game.findByIdAndRemove(id)
            .exec()
            .then(() => {
                resolve(null);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Delete;
