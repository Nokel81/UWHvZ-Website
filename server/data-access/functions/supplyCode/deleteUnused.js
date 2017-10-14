const Promise = require("bluebird");
const SupplyCode = rootRequire("server/schemas/supplyCode");

function deleteUnused() {
    return new Promise(function(resolve, reject) {
        SupplyCode.deleteMany({
            usedBy: {
                $exists: false
            }
        })
            .exec()
            .then(() => {
                resolve("All unused supply codes have been deleted");
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = deleteUnused;
