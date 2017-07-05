const BuildingLocation = rootRequire("server/schemas/buildingLocation");
const getAll = rootRequire("server/data-access/functions/buildingLocations/getAll");

function UpdateById(marker, cb) {
    BuildingLocation.findOneAndUpdate({_id: marker._id}, marker, (err, settings) => {
        if (err) {
            return cb({error: err});
        }
        getAll(cb);
    });
}

module.exports = UpdateById;
