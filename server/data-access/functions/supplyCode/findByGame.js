const SupplyCode = rootRequire("server/schemas/supplyCode");
const User = rootRequire("server/schemas/user");

function FindByUser(gameId, cb) {
    SupplyCode.find({forGame: gameId})
        .sort("code")
        .exec((err, codes) => {
            if (err) {
                return cb({error: err});
            }
            let userCodes = codes.map(code => code.usedBy).filter(code => code);
            User.find({
                _id: { $in: userCodes}
            })
            .select("playerName _id")
            .exec((err, users) => {
                if (err) {
                    return cb({error: err});
                }
                let res = [];
                codes.forEach(code => {
                    let j = JSON.parse(JSON.stringify(code));
                    j.usedByName = (users.find(user => user._id.toString() === (j.usedBy || "").toString()) || {}).playerName || "";
                    res.push(j);
                });
                console.log(res);
                cb({body: res});
            });
        });
}

module.exports = FindByUser;
