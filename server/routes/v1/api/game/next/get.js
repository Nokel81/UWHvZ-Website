const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {
        userId,
        isSuper
    } = req.headers;
    findCurrentOrNext()
        .then(game => {
            if (!game.moderators.find(x => x.toString() === userId) && !isSuper) {
                delete game.moderators;
                delete game.humans;
                delete game.zombies;
                delete game.spectators;
                delete game.originalZombies;
                delete game.moderatorObjs;
                delete game.humanObjs;
                delete game.zombieObjs;
                delete game.spectatorObjs;
                delete game.originalZombieObjs;
            }
            resolve(game);
        })
        .catch(error => {
            reject("Game not found: " + createErrorMessage(error));
        });
}

module.exports = Get;
