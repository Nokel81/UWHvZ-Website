const Promise = require("bluebird");
const SupplyCode = rootRequire("server/schemas/supplyCode");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");

function UseSupplyCode(info) {
    return new Promise(function(resolve, reject) {
        findCurrentOrNext()
            .then(game => {
                if (game.humans.indexOf(info.userId.toString()) < 0) {
                    return reject("You have to be a human to use a supply code");
                }

                return SupplyCode.updateOne({
                    code: info.code,
                    usedBy: {
                        $exists: false
                    },
                    forGame: game._id,
                }, {
                    $set: {
                        usedBy: info.userId
                    },
                })
                .exec();
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
