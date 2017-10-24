const Promise = require("bluebird");

const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");
const mailService = rootRequire("server/services/mail");

function Create(gameSignUp) {
    return new Promise(function(resolve, reject) {
        let gameObj;
        gameSignUp = new GameSignUp(gameSignUp);
        gameSignUp.validate()
            .then(() => {
                return gameSignUp.save();
            })
            .then(() => {
                return findByGame(gameSignUp.gameId);
            })
            .then(game => {
                gameObj = game;
                return mailService.sendSignUpEmail(gameSignUp, game);
            })
            .then(() => {
                resolve(gameObj);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Create;
