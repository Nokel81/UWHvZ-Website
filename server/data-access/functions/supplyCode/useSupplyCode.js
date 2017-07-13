const SupplyCode = rootRequire("server/schemas/supplyCode");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const User = rootRequire("server/schemas/user");

function UseSupplyCode(info, cb) {
    User.findOne({_id: info.userId})
        .exec((err, user) => {
            if (err) {
                return cb({error: err});
            }
            if (!user) {
                return cb({error: "That is not a valid user"});
            }
            findCurrentOrNext(res => {
                if (res.error) {
                    return cb(res);
                }
                const game = res.body;
                if (game.humans.indexOf(info.userId.toString()) < 0) {
                    return cb({error: "You have to be a human to use a supply code"});
                }
                SupplyCode.findOneAndUpdate({
                    code: info.code,
                    usedBy: {$exists: false},
                    forGame: game._id
                }, {
                    $set: {
                        usedBy: info.userId
                    }
                }, (err, supplyCode) => {
                    if (err) {
                        return cb({error: err});
                    }
                    if (!supplyCode) {
                        return cb({error: "Supply Code already used or does not exist for this game"});
                    }
                    cb({body: "Supply code used"});
                });
            });
        });
}

module.exports = UseSupplyCode;
