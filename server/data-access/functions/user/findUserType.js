const Promise = require("bluebird");

const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const levels = rootRequire("server/constants.json").securityNames;

function GetUserType(id, game) {
    return new Promise(function(resolve) {
        let promise = Promise.resolve(game);
        if (!game) {
            promise = findCurrentOrNext();
        }

        promise.then(game => {
            if (game.moderators.findIndex(x => x.toString() === id.toString()) >= 0) {
                resolve(levels.moderator);
            } else if (game.spectators.findIndex(x => x.toString() === id.toString()) >= 0) {
                resolve(levels.spectator);
            } else if (game.humans.findIndex(x => x.toString() === id.toString()) >= 0) {
                resolve(levels.human);
            } else if (game.zombies.findIndex(x => x.toString() === id.toString()) >= 0) {
                resolve(levels.zombie);
            } else {
                resolve(levels.nonplayer);
            }
        })
            .catch(() => {
                resolve(levels.nonplayer);
            });
    });
}

module.exports = GetUserType;
