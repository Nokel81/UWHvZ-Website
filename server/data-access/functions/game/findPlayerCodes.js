const Promise = require("bluebird");

const User = rootRequire("server/schemas/user");
const findGameById = rootRequire("server/data-access/functions/game/findById");

function FindGamePlayers(gameId) {
    return new Promise(function(resolve, reject) {
        findGameById(gameId)
            .then(game => {
                return User.find({}).sort("playerName").select("playerName playerCode").exec();
            })
            .then(users => {
                resolve(users);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = FindGamePlayers;
