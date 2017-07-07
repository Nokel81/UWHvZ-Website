const SupplyCode = rootRequire("server/schemas/supplyCode");

function FindByUser(id, gameId, cb) {
    SupplyCode.find({usedBy: id, forGame: gameId})
        .sort("code")
        .exec((err, codes) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: codes});
        });
}

module.exports = FindByUser;
