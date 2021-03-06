const Promise = require("bluebird");

const BuildingLocation = rootRequire("server/schemas/buildingLocation");
const getAll = rootRequire("server/data-access/functions/buildingLocations/getAll");

function UpdateById(marker) {
    return new Promise(function(resolve, reject) {
        BuildingLocation.findByIdAndRemove(marker._id)
            .exec()
            .then(() => {
                return getAll();
            })
            .then(locations => {
                resolve(locations);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = UpdateById;
