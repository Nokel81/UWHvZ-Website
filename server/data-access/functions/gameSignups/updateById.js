const Promise = require("bluebird");

const GameSignUp = rootRequire("server/schemas/gameSignUp");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function Update(signUp) {
    return new Promise(function(resolve, reject) {
        GameSignUp.findByIdAndUpdate(signUp._id, signUp, {
            new: true
        })
            .exec()
            .then(signUp => {
                return findByGame(signUp.gameId);
            })
            .then(signups => {
                resolve(signups);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Update;
