const Promise = require('bluebird');

const SupplyCode = rootRequire("server/schemas/supplyCode");

function FindByUser(id, gameId) {
    return new Promise(function(resolve, reject) {
        SupplyCode.find({usedBy: id, forGame: gameId})
        .sort("code")
        .exec()
        .then(codes => {
            resolve(codes);
        })
        .catch(error => {
            reject(error);
        })
    });
}

module.exports = FindByUser;
