const Promise = require("bluebird");

const Game = rootRequire("server/schemas/game");
const findById = rootRequire("server/data-access/functions/game/findById");

function Update(game) {
    return new Promise(function(resolve, reject) {
        Game.findOne({
            _id: game._id
        })
            .then(newGame => {
                newGame.name = game.name;
                newGame.description = game.description;
                newGame.signUpDates = game.signUpDates;
                newGame.signUpLocations = game.signUpLocations;
                newGame.startDate = game.startDate;
                newGame.endDate = game.endDate;
                newGame.suppliedValue = game.suppliedValue;
                newGame.railPassValue = game.railPassValue;
                newGame.minorPassValue = game.minorPassValue;
                newGame.majorPassValue = game.majorPassValue;
                newGame.officerValue = game.officerValue;
                newGame.isStarted = game.isStarted;
                return newGame.save();
            })
            .then(game => {
                return findById(game._id);
            })
            .then(game => {
                resolve(game);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Update;
