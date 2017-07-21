const Promise = require('bluebird');

const SupplyCode = rootRequire("server/schemas/supplyCode");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const findById = rootRequire("server/data-access/functions/user/findById");

function UseSupplyCode(info) {
    return new Promise(function(resolve, reject) {
        let user = null;
        findById(info.userId)
        .then(userObj => {
            user = userObj;
            return findCurrentOrNext();
        })
        .then(game => {
            if (game.humans.indexOf(info.userId.toString()) < 0) {
                return reject("You have to be a human to use a supply code");
            }
            return SupplyCode.findOneAndUpdate({code: info.code, usedBy: {$exists: false}, forGame: game._id}, {$set: {usedBy: info.userId}).exec();
        })
        .then(code => {
            if (!code) {
                return reject("Supply Code already used or does not exist for this game");
            }
            resolve("Supply code used");
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = UseSupplyCode;
