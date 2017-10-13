const Promise = require("bluebird");

const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function FindById(gameId) {
    return new Promise(function(resolve, reject) {
        findByGame(gameId)
            .then(signups => {
                resolve(signups.filter(signUp => signUp.teamPreference === "Zombie"));
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindById;
