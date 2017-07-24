const Promise = require('bluebird');
const fs = require("fs");

const User = rootRequire("server/schemas/user");
const GameSignUp = rootRequire("server/schemas/gameSignUp");
const sendStartingEmail = rootRequire("server/data-access/functions/message/sendStartingEmail");
const findByGame = rootRequire("server/data-access/functions/gameSignups/findByGame");

function StartGame(zombieEmails, gameId, HTMLlore, fileData) {
    return new Promise(function(resolve, reject) {
        let game = null;
        let spectatorEmails = null;
        let humanEmails = null;
        Game.findOne({_id: gameId})
        .exec()
        .then(gameObj => {
            game = gameObj;
            if (game.isStarted) {
                return reject("Game has already been started");
            }
            return findByGame(gameId);
        })
        .then(signups => {
            spectatorEmails = signups.filter(signup => signup.teamPreference === "Spectator").map(signup => signup.userEmail);
            humanEmails = signups.filter(signup => signup.teamPreference === "Human" || (OZemails.indexOf(signup.userEmail) < 0 && signup.teamPreference === "Zombie")).map(signup => signup.userEmail);
            return User.find({email: {$in: signups.map(signup => signup.userEmail)}}).select("_id email").exec();
        })
        .then(users => {
            game.zombies = game.originalZombies = users.filter(user => zombieEmails.indexOf(user.email) >= 0).map(user => user._id);
            game.spectators = users.filter(user => spectatorEmails.indexOf(user.email) >= 0).map(user => user._id);
            game.humans = users.filter(user => humanEmails.indexOf(user.email) >= 0).map(user => user._id);
            game.isStarted = true;
            return User.find({_id: {$in: game.zombies}}).select("playerName").exec();
        })
        .then(users => {
            return Promise.join(sendStartingEmail(spectatorEmails, "Spectator", game, HTMLlore, fileData),
                                sendStartingEmail(humanEmails, "Human", game, HTMLlore, fileData),
                                sendStartingEmail(zombieEmails, "Zombie", game, HTMLlore, fileData, clone(users).map(user => user.playerName)));
        })
        .then(noerror => {
            fileData.forEach(fileData => {
                fs.unlink(fileData.path);
            });
            game.save();
        })
        .then(game => {
            resolve("Game has been started");
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = StartGame;
