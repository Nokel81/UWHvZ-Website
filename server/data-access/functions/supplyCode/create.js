const SupplyCode = rootRequire("server/schemas/supplyCode");

function Create(supplyCode, cb) {
    const newSupplyCode = new SupplyCode(supplyCode);
    newSupplyCode.validate(err => {
        if (err) {
            return cb({error: err});
        }
        newSupplyCode.save((err, supplyCode) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: "Supply Code create with code: " + supplyCode.code});
        });
    });
}

module.exports = Create;
