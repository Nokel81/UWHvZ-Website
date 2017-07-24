const Promise = require('bluebird');

const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");

function GetUserType(id, game) {
    id = id.toString();
    return new Promise(function(resolve, reject) {
        let promise = new Promise(function(resolve, reject) {
            resolve(game);
        });
        if (!game) {
            promise = findCurrentOrNext();
        }

        promise.then(game => {
            if (game.moderators.indexOf(id) >= 0) {
                resolve("Moderator");
            } else if (game.zombies.indexOf(id) >= 0) {
                resolve("Zombie");
            } else if (game.humans.indexOf(id) >= 0) {
                resolve("Human");
            } else if (game.spectators.indexOf(id) >= 0) {
                resolve("Spectator");
            } else {
                resolve("NonPlayer");
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = GetUserType;
