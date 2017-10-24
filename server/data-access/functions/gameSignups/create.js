const Promise = require("bluebird");

const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");
const findById = rootRequire("server/data-access/functions/game/findById");
const mailService = rootRequire("server/services/mail");

function Create(gameSignUp) {
    return new Promise(function(resolve, reject) {
        let signupObjs;
        gameSignUp = new GameSignUp(gameSignUp);
        gameSignUp.validate()
            .then(() => {
                return gameSignUp.save();
            })
            .then(() => {
                return findByGame(gameSignUp.gameId);
            })
            .then(signups => {
                signupObjs = signups;
                return findById(gameSignUp.gameId);
            })
            .then(game => {
                return mailService.sendSignUpEmail(gameSignUp, game);
            })
            .then(() => {
                resolve(signupObjs);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Create;
