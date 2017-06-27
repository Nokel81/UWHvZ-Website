const SupplyCode = rootRequire("server/schemas/supplyCode");

function Create (supplyCode, cb) {
    const newSupplyCode = new SupplyCode(supplyCode);
    supplyCode.validate(err => {
        if (err) {
            return cb({ error: err });
        }
        supplyCode.save((err, supplyCode) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: "Supply Code create with code: " + supplyCode.code });
        });
    });
};

module.exports = Create;
