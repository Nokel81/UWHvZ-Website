const Promise = require("bluebird");

const BuildingLocation = rootRequire("server/schemas/buildingLocation");

function GetAll() {
    return new Promise(function(resolve, reject) {
        BuildingLocation.find({})
            .sort("acronym")
            .exec()
            .then(locations => {
                resolve(locations);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = GetAll;
