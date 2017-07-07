const SupplyCode = rootRequire("server/schemas/supplyCode");
const findByGame = rootRequire("server/data-access/functions/supplyCode/findByGame");

function Create(supplyCodes, gameId, cb) {
    SupplyCode.insertMany(supplyCodes, (err, codes) => {
            if (err) {
                return cb({error: err});
            }
            if (supplyCodes.length === 0) {
                return cb({body: []});
            }
            findByGame(gameId, cb);
        });
}

module.exports = Create;
