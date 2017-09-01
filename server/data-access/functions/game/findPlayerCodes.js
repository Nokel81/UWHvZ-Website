const Promise = require('bluebird');

const User = rootRequire("server/schemas/user");
const Settings = rootRequire("server/schemas/settings");
const findGameById = rootRequire("server/data-access/functions/game/findById");
const findUserScore = rootRequire("server/data-access/functions/game/findUserScore");

function FindGamePlayers(gameId, userId) {
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
