const Promise = require("bluebird");

const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");

function GetUserType(id, game) {
    id = id.toString();
    return new Promise(function(resolve) {
        let promise = Promise.resolve(game);
        if (!game) {
            promise = findCurrentOrNext();
        }

        promise.then(game => {
            if (game.moderators.findIndex(x => x.toString() === id.toString()) >= 0) {
                resolve("Moderator");
            } else if (game.spectators.findIndex(x => x.toString() === id.toString()) >= 0) {
                resolve("Spectator");
            } else if (game.humans.findIndex(x => x.toString() === id.toString()) >= 0) {
                resolve("Human");
            } else if (game.zombies.findIndex(x => x.toString() === id.toString()) >= 0) {
                resolve("Zombie");
            } else {
                resolve("NonPlayer");
            }
        })
            .catch(() => {
                resolve("NonPlayer");
            });
    });
}

module.exports = GetUserType;
