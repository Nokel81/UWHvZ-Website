const Promise = require("bluebird");
const SupplyCode = rootRequire("server/schemas/supplyCode");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const levels = rootRequire("server/constants.json").securityNames;

function UseSupplyCode(info, userType) {
    return new Promise(function(resolve, reject) {
        findCurrentOrNext()
            .then(game => {
                if (![levels.human, levels.moderator].includes(userType)) {
                    return reject("You have to be a human to use a supply code");
                }

                return SupplyCode.findOneAndUpdate({
                    code: info.code.toLowerCase(),
                    usedBy: {
                        $exists: false
                    },
                    forGame: game._id,
                }, {
                    $set: {
                        usedBy: info.userId
                    },
                }, {
                    new: true
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
