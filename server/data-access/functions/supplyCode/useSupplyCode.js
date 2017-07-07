const SupplyCode = rootRequire("server/schemas/supplyCode");
const findCurrentOrNext = rootRequire("server/data-access/functions/game/findCurrentOrNext");
const User = rootRequire("server/schemas/user");

function FindByUser(info, cb) {
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
                if (!game) {
                    return cb({error: "There is no current game"});
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

module.exports = FindByUser;
