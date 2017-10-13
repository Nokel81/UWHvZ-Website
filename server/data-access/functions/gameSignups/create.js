const Promise = require("bluebird");

const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Create(gameSignUp, skipDoFindByGame) {
    return new Promise(function(resolve, reject) {
        gameSignUp = new GameSignUp(gameSignUp);
        gameSignUp.validate()
            .then(() => {
                return gameSignUp.save();
            })
            .then(() => {
                if (skipDoFindByGame) {
                    resolve("User signed up and Email confirmation has been sent");
                } else {
                    return findByGame(gameSignUp.gameId);
                }
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
