const Promise = require('bluebird');

const BuildingLocation = rootRequire("server/schemas/buildingLocation");
const getAll = rootRequire("server/data-access/functions/buildingLocations/getAll");

function Create(marker) {
    return new Promise(function(resolve, reject) {
        let location = new BuildingLocation(marker);
        location.validate()
        .then(noerror => {
            return location.save();
        })
        .then(noerror => {
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

module.exports = Create;
