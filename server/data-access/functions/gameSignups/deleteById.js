const Promise = require('bluebird');

const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Delete(id) {
    return new Promise(function(resolve, reject) {
        GameSignUp.findByIdAndRemove(id)
        .exec()
        .then(game => {
            return findCurrentOrNext();
        })
        .then(game => {
            return findByGame(game._id);
        })
        .then(signups => {
            resolve(signups);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = Delete;
