const Promise = require("bluebird");

const SupplyCode = rootRequire("server/schemas/supplyCode");
const findByGame = rootRequire("server/data-access/functions/supplyCode/findByGame");

function Create(supplyCodes, gameId) {
    return new Promise(function(resolve, reject) {
        supplyCodes = supplyCodes.map(supplyCode => {
            let x = new SupplyCode(supplyCode);
            return x.save();
        });
        Promise.all(supplyCodes)
            .then(() => {
                return findByGame(gameId);
            })
            .then(codes => {
                resolve(codes);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = Create;
