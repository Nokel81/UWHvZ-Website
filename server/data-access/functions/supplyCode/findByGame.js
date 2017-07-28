const Promise = require('bluebird');

const SupplyCode = rootRequire("server/schemas/supplyCode");
const User = rootRequire("server/schemas/user");
const clone = rootRequire("server/helpers/clone");

function FindByUser(gameId) {
    return new Promise(function(resolve, reject) {
        let codes = [];
        SupplyCode.find({forGame: gameId})
        .sort("code")
        .exec()
        .then(codeObjs => {
            codes = codeObjs;
            return User.find({_id: { $in: codes.map(code => code.usedBy).filter(code => code)}}).select("playerName _id").exec();
        })
        .then(users => {
            resolve(clone(codes).map(code => {
                code.usedByName = (users.find(user => user._id.toString() === (j.usedBy || "").toString()) || {}).playerName || "";
                return code;
            }));
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = FindByUser;
