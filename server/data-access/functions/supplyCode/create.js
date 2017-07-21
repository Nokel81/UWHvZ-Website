const Promise = require('bluebird');

const SupplyCode = rootRequire("server/schemas/supplyCode");
const findByGame = rootRequire("server/data-access/functions/supplyCode/findByGame");

function Create(supplyCodes, gameId) {
    return new Promise(function(resolve, reject) {
        SupplyCode.insertMany(supplyCodes)
        .exec()
        .then(codes => {
            return findByGame(gameId);
        })
        .then(codes => {
            resolve(codes);
        })
        .catch(error => {
            reject(error);
        })
    });
}

module.exports = Create;
