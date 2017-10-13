const Promise = require("bluebird");

const BuildingLocation = rootRequire("server/schemas/buildingLocation");

function GetByAcronym(acronym) {
    return new Promise(function(resolve, reject) {
        BuildingLocation.findOne({
            acronym
        })
            .exec()
            .then(location => {
                resolve(location);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = GetByAcronym;
