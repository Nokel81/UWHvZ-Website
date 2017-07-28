const Promise = require('bluebird');

const Game = rootRequire("server/schemas/game");
const User = rootRequire("server/schemas/user");
const clone = rootRequire("server/helpers/clone");

function FindById(id) {
    return new Promise(function(resolve, reject) {
        let moderators = [];
        let humans = [];
        let zombies = [];
        let originalZombies = [];
        let game = null;
        Game.findById(id).exec()
        .then(gameObj => {
            game = gameObj;
            return User.find({_id: {$in: game.moderators}}).sort("playerName").select("-password -nonce").exec();
        })
        .then(mods => {
            moderators = mods;
            return User.find({_id: {$in: game.humans}}).sort("playerName").select("-password -nonce").exec();
        })
        .then(hums => {
            humans = hums;
            return User.find({_id: {$in: game.zombies}}).sort("playerName").select("-password -nonce").exec();
        })
        .then(zombs => {
            zombies = zombs;
            return User.find({_id: {$in: game.originalZombies}}).sort("playerName").select("-password -nonce").exec();
        })
        .then(orgZombs => {
            originalZombies = orgZombs;
            return User.find({_id: {$in: game.spectators}}).sort("playerName").select("-password -nonce").exec();
        })
        .then(spectators => {
            const gameRes = clone(game);
            gameRes.moderatorObjs = moderators;
            gameRes.humanObjs = humans;
            gameRes.zombieObjs = zombies;
            gameRes.spectatorObjs = spectators;

            resolve(gameRes);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = FindById;
